// src/AdminPanel.jsx - EMAIL TEST BUTONLARI EKLENMİŞ VERSİYON
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Users, FileText, CheckCircle, XCircle, Trash2, UserCheck, Mail, Calendar } from 'lucide-react';
import { sendTestEmail, sendUserRegistrationEmail, sendTestimonialEmail } from './freeEmailService';

const AdminPanel = ({ language }) => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingTestimonials, setPendingTestimonials] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    const translations = {
        tr: {
            title: 'Admin Paneli',
            tabs: {
                users: 'Kullanıcı Onayları',
                testimonials: 'Anı Onayları',
                allUsers: 'Tüm Kullanıcılar'
            },
            users: {
                pending: 'Onay Bekleyen Kullanıcılar',
                noPending: 'Onay bekleyen kullanıcı yok',
                approve: 'Onayla',
                reject: 'Reddet',
                name: 'İsim',
                email: 'Email',
                date: 'Kayıt Tarihi'
            },
            testimonials: {
                pending: 'Onay Bekleyen Anılar',
                noPending: 'Onay bekleyen anı yok',
                approve: 'Onayla',
                reject: 'Reddet',
                author: 'Yazar',
                content: 'İçerik',
                date: 'Tarih'
            },
            allUsers: {
                title: 'Tüm Kullanıcılar',
                noUsers: 'Kullanıcı yok',
                role: 'Rol',
                status: 'Durum',
                approved: 'Onaylı',
                pending: 'Beklemede',
                makeAdmin: 'Admin Yap',
                removeAdmin: 'Admin Kaldır'
            },
            messages: {
                userApproved: 'Kullanıcı onaylandı!',
                userRejected: 'Kullanıcı reddedildi!',
                testimonialApproved: 'Anı onaylandı!',
                testimonialRejected: 'Anı reddedildi!',
                error: 'Bir hata oluştu!',
                confirmReject: 'Reddetmek istediğinize emin misiniz?'
            }
        },
        en: {
            title: 'Admin Panel',
            tabs: {
                users: 'User Approvals',
                testimonials: 'Testimonial Approvals',
                allUsers: 'All Users'
            },
            users: {
                pending: 'Pending Users',
                noPending: 'No pending users',
                approve: 'Approve',
                reject: 'Reject',
                name: 'Name',
                email: 'Email',
                date: 'Registration Date'
            },
            testimonials: {
                pending: 'Pending Testimonials',
                noPending: 'No pending testimonials',
                approve: 'Approve',
                reject: 'Reject',
                author: 'Author',
                content: 'Content',
                date: 'Date'
            },
            allUsers: {
                title: 'All Users',
                noUsers: 'No users',
                role: 'Role',
                status: 'Status',
                approved: 'Approved',
                pending: 'Pending',
                makeAdmin: 'Make Admin',
                removeAdmin: 'Remove Admin'
            },
            messages: {
                userApproved: 'User approved!',
                userRejected: 'User rejected!',
                testimonialApproved: 'Testimonial approved!',
                testimonialRejected: 'Testimonial rejected!',
                error: 'An error occurred!',
                confirmReject: 'Are you sure you want to reject?'
            }
        }
    };

    const t = translations[language];

    // Metin kısaltma fonksiyonu
    const truncateText = (text, maxLength = 150) => {
        if (!text || text.length <= maxLength) return text;
        
        // Son boşlukta kes, kelime ortasında kesme
        const truncated = text.substring(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        
        if (lastSpaceIndex > maxLength * 0.8) {
            return truncated.substring(0, lastSpaceIndex) + '...';
        }
        
        return truncated + '...';
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        console.log('🔍 Admin Panel: Fetching data...');
        
        try {
            // Onay bekleyen kullanıcılar
            console.log('📊 Fetching pending users...');
            const usersQuery = query(
                collection(db, 'users'),
                where('approved', '==', false)
            );
            const usersSnapshot = await getDocs(usersQuery);
            console.log(`✅ Found ${usersSnapshot.size} pending users`);
            const usersData = usersSnapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            setPendingUsers(usersData);

            // Onay bekleyen testimonials - orderBy KALDIRILDI (index sorunu için)
            console.log('📊 Fetching pending testimonials...');
            const testimonialsQuery = query(
                collection(db, 'testimonials'),
                where('status', '==', 'pending')
            );
            const testimonialsSnapshot = await getDocs(testimonialsQuery);
            console.log(`✅ Found ${testimonialsSnapshot.size} pending testimonials`);
            
            // Manuel sıralama (en yeniden eskiye)
            const testimonialsData = testimonialsSnapshot.docs
                .map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }))
                .sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return b.createdAt.seconds - a.createdAt.seconds;
                });
            setPendingTestimonials(testimonialsData);

            // Tüm kullanıcılar
            console.log('📊 Fetching all users...');
            const allUsersSnapshot = await getDocs(collection(db, 'users'));
            console.log(`✅ Found ${allUsersSnapshot.size} total users`);
            setAllUsers(allUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            console.log('🎉 All data fetched successfully!');
        } catch (error) {
            console.error('❌ Error fetching data:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            alert(`Hata: ${error.message}\n\nFirestore Rules kontrol edin!`);
        }
        setLoading(false);
    };

    const approveUser = async (userId) => {
        try {
            await updateDoc(doc(db, 'users', userId), {
                approved: true
            });
            alert(t.messages.userApproved);
            fetchData();
        } catch (error) {
            console.error('Error approving user:', error);
            alert(t.messages.error + '\n' + error.message);
        }
    };

    const rejectUser = async (userId) => {
        if (window.confirm(t.messages.confirmReject)) {
            try {
                await deleteDoc(doc(db, 'users', userId));
                alert(t.messages.userRejected);
                fetchData();
            } catch (error) {
                console.error('Error rejecting user:', error);
                alert(t.messages.error + '\n' + error.message);
            }
        }
    };

    const approveTestimonial = async (testimonialId) => {
        try {
            await updateDoc(doc(db, 'testimonials', testimonialId), {
                status: 'approved'
            });
            alert(t.messages.testimonialApproved);
            fetchData();
        } catch (error) {
            console.error('Error approving testimonial:', error);
            alert(t.messages.error + '\n' + error.message);
        }
    };

    const rejectTestimonial = async (testimonialId) => {
        if (window.confirm(t.messages.confirmReject)) {
            try {
                await deleteDoc(doc(db, 'testimonials', testimonialId));
                alert(t.messages.testimonialRejected);
                fetchData();
            } catch (error) {
                console.error('Error rejecting testimonial:', error);
                alert(t.messages.error + '\n' + error.message);
            }
        }
    };

    const toggleAdmin = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'visitor' : 'admin';
        try {
            await updateDoc(doc(db, 'users', userId), {
                role: newRole,
                approved: true
            });
            alert(newRole === 'admin' ? 'Admin yapıldı!' : 'Admin kaldırıldı!');
            fetchData();
        } catch (error) {
            console.error('Error toggling admin:', error);
            alert(t.messages.error + '\n' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-slate-800 text-center mb-12">{t.title}</h1>

                {/* Debug Info + Web3Forms Test Butonları */}
                <div className="mb-8 p-4 bg-blue-100 rounded-lg text-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <p>📊 Pending Users: {pendingUsers.length}</p>
                            <p>📊 Pending Testimonials: {pendingTestimonials.length}</p>
                            <p>📊 Total Users: {allUsers.length}</p>
                            <p className="text-xs text-green-600 mt-2">🔥 Web3Forms Email Sistemi Aktif</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={async () => {
                                    try {
                                        const result = await sendTestEmail();
                                        alert(result.success ? '✅ Web3Forms test email gönderildi!' : '❌ Email gönderilemedi!');
                                    } catch (error) {
                                        alert('❌ Email hatası: ' + error.message);
                                    }
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                            >
                                <Mail size={14} />
                                Test Email
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const result = await sendUserRegistrationEmail({
                                            displayName: 'Test Kullanıcı',
                                            email: 'test@example.com'
                                        });
                                        alert(result.success ? '✅ Web3Forms user notification gönderildi!' : '❌ Email gönderilemedi!');
                                    } catch (error) {
                                        alert('❌ Email hatası: ' + error.message);
                                    }
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                            >
                                <Users size={14} />
                                Test User Email
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const result = await sendTestimonialEmail(
                                            {
                                                authorName: 'Test Author',
                                                content: 'Bu bir test anısıdır. Çok güzel bir anı...'
                                            },
                                            { email: 'testauthor@example.com' }
                                        );
                                        alert(result.success ? '✅ Web3Forms testimonial notification gönderildi!' : '❌ Email gönderilemedi!');
                                    } catch (error) {
                                        alert('❌ Email hatası: ' + error.message);
                                    }
                                }}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                            >
                                <FileText size={14} />
                                Test Anı Email
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'users' ? 'bg-slate-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Users className="inline mr-2" size={20} />
                        {t.tabs.users}
                    </button>
                    <button
                        onClick={() => setActiveTab('testimonials')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'testimonials' ? 'bg-slate-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <FileText className="inline mr-2" size={20} />
                        {t.tabs.testimonials}
                    </button>
                    <button
                        onClick={() => setActiveTab('allUsers')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'allUsers' ? 'bg-slate-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <UserCheck className="inline mr-2" size={20} />
                        {t.tabs.allUsers}
                    </button>
                </div>

                {/* Pending Users */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.users.pending}</h2>
                        {pendingUsers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">{t.users.noPending}</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map(user => (
                                    <div key={user.id} className="border-2 border-gray-200 rounded-lg p-6 flex justify-between items-center">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <h3 className="text-xl font-bold text-gray-800 truncate">{user.displayName}</h3>
                                            <p className="text-gray-600 truncate">{user.email}</p>
                                            <p className="text-sm text-gray-500">
                                                {user.createdAt?.toDate().toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                        <div className="flex gap-3 flex-shrink-0">
                                            <button
                                                onClick={() => approveUser(user.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                {t.users.approve}
                                            </button>
                                            <button
                                                onClick={() => rejectUser(user.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                            >
                                                <XCircle size={18} />
                                                {t.users.reject}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pending Testimonials */}
                {activeTab === 'testimonials' && (
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.testimonials.pending}</h2>
                        {pendingTestimonials.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">{t.testimonials.noPending}</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingTestimonials.map(testimonial => (
                                    <div key={testimonial.id} className="border-2 border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-gray-800 truncate">{testimonial.authorName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {testimonial.createdAt?.toDate().toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                            <div className="flex gap-3 flex-shrink-0">
                                                <button
                                                    onClick={() => approveTestimonial(testimonial.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                                >
                                                    <CheckCircle size={18} />
                                                    {t.testimonials.approve}
                                                </button>
                                                <button
                                                    onClick={() => rejectTestimonial(testimonial.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                                >
                                                    <Trash2 size={18} />
                                                    {t.testimonials.reject}
                                                </button>
                                            </div>
                                        </div>
                                        <div 
                                            className="bg-gray-50 p-4 rounded-lg border-l-4 border-slate-400"
                                            style={{
                                                wordWrap: 'break-word',
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                                maxWidth: '100%'
                                            }}
                                        >
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {truncateText(testimonial.content, 300)}
                                            </p>
                                            {testimonial.content && testimonial.content.length > 300 && (
                                                <p className="text-sm text-gray-500 mt-2 italic">
                                                    ({testimonial.content.length} karakter - kısaltılmış)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* All Users */}
                {activeTab === 'allUsers' && (
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.allUsers.title}</h2>
                        {allUsers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">{t.allUsers.noUsers}</p>
                        ) : (
                            <div className="space-y-4">
                                {allUsers.map(user => (
                                    <div key={user.id} className="border-2 border-gray-200 rounded-lg p-6 flex justify-between items-center">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <h3 className="text-xl font-bold text-gray-800 truncate">{user.displayName}</h3>
                                            <p className="text-gray-600 truncate">{user.email}</p>
                                            <div className="flex gap-4 mt-2">
                                                <span className={`text-sm px-3 py-1 rounded ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                                <span className={`text-sm px-3 py-1 rounded ${
                                                    user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.approved ? t.allUsers.approved : t.allUsers.pending}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleAdmin(user.id, user.role)}
                                            className={`px-4 py-2 rounded-lg font-semibold flex-shrink-0 ${
                                                user.role === 'admin'
                                                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                                            }`}
                                        >
                                            {user.role === 'admin' ? t.allUsers.removeAdmin : t.allUsers.makeAdmin}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Inline CSS for better text wrapping */}
            <style jsx>{`
                .truncate {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .flex-1 {
                    min-width: 0; /* Allows text truncation in flex items */
                }
                
                .whitespace-pre-wrap {
                    white-space: pre-wrap;
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;