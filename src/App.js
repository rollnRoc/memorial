// src/App.js
import React, { useState, useEffect } from 'react';
import { Heart, Image, BookOpen, User, Calendar, Scale, LogOut, Settings, ChevronDown, ChevronUp, FileText, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { AuthPage, PendingApproval } from './Auth';
import AdminPanel from './AdminPanel';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const MemorialWebsite = () => {
  // Auth state
  const { user, userData, logout } = useAuth();

  // Existing states
  const [activeSection, setActiveSection] = useState('home');
  const [memories, setMemories] = useState([]);
  const [formData, setFormData] = useState({ name: '', memory: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState('tr');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showHeader, setShowHeader] = useState(false);
  const [selectedMemorialCategory, setSelectedMemorialCategory] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileImage = './1st-photo.jpg';
  const leftPhoto = './left-photo.jpg';
  const rightPhoto = './right-photo.jpg';
  const slideImages = [
    './slayt1.jpg',
    './slayt2.jpg',
    './slayt3.jpg'
  ];

  const translations = {
    tr: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkında',
        memorials: 'Projeler - Ödüller',
        gallery: 'Hatıralar',
        blog: 'Anılar',
        news: 'Basından Haberler',
        admin: 'Admin Paneli',
        logout: 'Çıkış Yap'
      },
      auth: {
        welcome: 'Hoş geldin',
        pendingApproval: 'Üyeliğiniz onay bekliyor'
      },
      gallery: {
        title: 'Hatıralar',
        childhood: 'Çocukluk',
        youth: 'Gençlik',
        adulthood: 'Yetişkinlik',
        backToCategories: 'Kategorilere Dön'
      },
      memorials: {
        title: 'Projeler - Ödüller',
        projects: 'Projeler',
        awards: 'Ödüller',
        drawings: 'Karakalem Çalışmaları',
        backToCategories: 'Kategorilere Dön'
      },
      blog: {
        title: 'Anılar',
        shareTitle: 'Bir Anı Paylaş',
        nameLabel: 'Adınız',
        namePlaceholder: 'İsminizi yazın',
        memoryLabel: 'Anınız',
        memoryPlaceholder: 'Güzel bir anınızı bizimle paylaşın...',
        submitButton: 'Anıyı Paylaş',
        submitting: 'Gönderiliyor...',
        sharedTitle: 'Paylaşılan Anılar',
        noMemories: 'Henüz anı paylaşılmamış. İlk anıyı siz paylaşın.',
        loginRequired: 'Anı paylaşmak için giriş yapmalısınız.',
        readMore: 'Devamını Oku',
        readLess: 'Daha Az Göster'
      },
      copyright: {
        button: 'Telif Hakkı',
        title: 'Telif Hakkı Bildirimi',
        content: 'Bu web sitesi üzerindeki tüm resim ve yazı içerikleri, Gökçe Önal ailesine aittir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında korunmaktadır. Sitemizde yer alan metinler, görseller, videolar ve diğer tüm materyaller, izinsiz olarak kopyalanamaz, dağıtılamaz veya kullanılamaz. Web sitemizi ziyaret ettiğiniz için teşekkür ederiz. İçeriklerimize saygı göstermeniz, hem yasal haklarımızı korumamızı, hem de  Gökçe Önal \'a saygı gösterilmesini sağlayacaktır.',
        close: 'Kapat'
      },
      footer: 'Sevgiyle anıyoruz'
    },
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        memorials: 'Projects - Awards',
        gallery: 'Memories',
        blog: 'Testimonials',
        news: 'Press News',
        admin: 'Admin Panel',
        logout: 'Logout'
      },
      auth: {
        welcome: 'Welcome',
        pendingApproval: 'Your membership is pending approval'
      },
      gallery: {
        title: 'Memories',
        childhood: 'Childhood',
        youth: 'Youth',
        adulthood: 'Adulthood',
        backToCategories: 'Back to Categories'
      },
      memorials: {
        title: 'Projects - Awards',
        projects: 'Projects',
        awards: 'Awards',
        drawings: 'Charcoal Drawings',
        backToCategories: 'Back to Categories'
      },
      blog: {
        title: 'Testimonials',
        shareTitle: 'Share a Memory',
        nameLabel: 'Your Name',
        namePlaceholder: 'Enter your name',
        memoryLabel: 'Your Memory',
        memoryPlaceholder: 'Share a beautiful memory with us...',
        submitButton: 'Share Memory',
        submitting: 'Submitting...',
        sharedTitle: 'Shared Memories',
        noMemories: 'No memories shared yet. Be the first to share.',
        loginRequired: 'You must be logged in to share a memory.',
        readMore: 'Read More',
        readLess: 'Show Less'
      },
      copyright: {
        button: 'Copyright',
        title: 'Copyright Notice',
        content: 'All images and written content on this website belong to the family of Gökçe Önal and are protected under the Turkish Law No. 5846 on Intellectual and Artistic Works. All texts, images, videos, and other materials on this site cannot be copied, distributed, or used without permission. Any unauthorized use may result in legal action. Thank you for visiting our website. Respecting our content will help us protect our legal rights and show respect to Gökçe Önal.',
        close: 'Close'
      },
      footer: 'Remembered with love'
    }
  };

  const t = translations[language];

  const galleryCategories = {
    childhood: {
      coverImage: './slayt1.jpg',
      images: [
        { src: './cocukluk1.jpg', caption: '' },
        { src: './cocukluk2.jpg', caption: '' },
        { src: './cocukluk3.jpg', caption: '' },
        { src: './cocukluk4.jpg', caption: '' },
        { src: './cocukluk5.jpg', caption: '' },
        { src: './cocukluk6.jpg', caption: '' },
        { src: './cocukluk7.jpg', caption: '' },
        { src: './cocukluk8.jpg', caption: '' },
        { src: './cocukluk9.jpg', caption: '' },
        { src: './cocukluk10.jpg', caption: '' },
        { src: './cocukluk11.jpg', caption: '' },
        { src: './cocukluk12.jpg', caption: '' }
      ]
    },
    youth: {
      coverImage: './slayt2.jpg',
      images: [
        { src: './genclik5.jpg', caption: { tr: 'Şubat 2014, ODTÜ', en: 'February 2014, METU' } },
        { src: './genclik2.jpg', caption: { tr: 'Şubat 2014, ODTÜ', en: 'February 2014, METU' } },
        { src: './genclik3.jpg', caption: { tr: 'Şubat 2014, ODTÜ', en: 'February 2014, METU' } },
        { src: './genclik4.jpg', caption: { tr: 'Şubat 2014, ODTÜ', en: 'February 2014, METU' } },
        { src: './genclik1.jpg', caption: '' },
        { src: './genclik6.jpg', caption: { tr: 'Şubat 2025, Rotterdam', en: 'February 2025, Rotterdam' } },
        { src: './genclik7.jpg', caption: '' },
        { src: './genclik8.jpg', caption: '' },
        { src: './genclik9.jpg', caption: '' }
      ]
    },
    adulthood: {
      coverImage: './slayt3.jpg',
      images: [
        { src: './yetiskin1.jpg', caption: '' },
        { src: './yetiskin2.jpg', caption: '' },
        { src: './yetiskin3.jpg', caption: { tr: 'İstanbul Maratonu, Kasım 2021', en: 'Istanbul Marathon, November 2021' } },
        { src: './yetiskin4.jpg', caption: { tr: 'Mısır, Mart 2023', en: 'Egypt, March 2023' } },
        { src: './yetiskin5.jpg', caption: { tr: 'Mısır, Mart 2023', en: 'Egypt, March 2023' } },
      ]
    }
  };

  const memorialCategories = {
    projects: {
      coverImage: './panel-1.jpg',
      images: [
        { src: './proje-calisma(tahta).jpg' },
        { src: './proje-sunum1.jpg' },
        { src: './proje-sunum2.jpg' },
        { src: './panel-2.jpg' }
        
      ]
    },
    awards: {
      coverImage: './ataturk-award.jpg',
      images: [
        { src: './elemantary-award.jpg' },
        { src: './gencmimar-award.jpg' },
        { src: './kocSchool-award.jpg' },
        { src: './music-award.jpg' },
        { src: './raf.jpg' },
        { src: './izocam.jpg' },
        { src: './left-photo.jpg' }
      ]
    },
    drawings: {
      coverImage: './proje-calisma(resim).jpg',
      images: [
        { src: './karakalem1.jpg'},
        { src: './karakalem2.jpg'},
        { src: './karakalem3.jpg'},
        { src: './karakalem4.jpg'},
        { src: './karakalem5.jpg'},
        { src: './karakalem6.jpg'},
        { src: './karakalem7.jpg'},
        { src: './karakalem8.jpg'},
        { src: './karakalem9.jpg'},
        { src: './karakalem10.jpg'},
        { src: './karakalem11.jpg'},
        { src: './karakalem12.jpg'},
        { src: './karakalem13.jpg'},
        { src: './karakalem14.jpg'},
        { src: './karakalem15.jpg'},
        { src: './karakalem16.jpg'}
      ]
    }
  };
  
  const newsData = [
    {
      id: 1,
      title_tr: 'Mimar Gökçe Önal Vefat Etti',
      title_en: 'Architect Gökçe Önal has passed away.',
      imageUrl: './hakkinda.jpg',
      sourceUrl: 'https://www.arkitera.com/haber/mimar-gokce-onal-vefat-etti/'
    },
    {
      id: 2,
      title_tr: 'Genç Yaşta Hayatını Kaybeden Mimar Gökçe Önal Kimdir?',
      title_en: 'Who is Gökçe Önal, the Architect Who Passed Away at a Young Age?',
      imageUrl: './genclik7.jpg',
      sourceUrl: 'https://www.sonmuhur.com/genc-yasta-hayatini-kaybeden-mimar-gokce-onal-kimdir'
    },
    {
      id: 3,
      title_tr: 'Gökçe Önal Kimdir, Nereli, Kaç Yaşında, Öldü Mü, Akademik Kariyeri, Neden Öldü, Mimar Mıydı?',
      title_en: 'Who is Gökçe Önal, Where Is She From, How Old Is She, Is She Dead, What Is Her Academic Background, Why Did She Die, Was She an Architect?',
      imageUrl: './haber.png',
      sourceUrl: 'https://www.yenikiroba.com/gokce-onal-kimdir-nereli-kac-yasinda-oldu-mu-akademik-kariyeri-neden-oldu-mimar-miydi'
    }
  ];

  // Firebase'den anıları çek
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        console.log('🔍 Anılar: Onaylı anılar getiriliyor...');

        const q = query(
          collection(db, 'testimonials'),
          where('status', '==', 'approved')
        );

        const querySnapshot = await getDocs(q);
        console.log(`✅ Anılar: ${querySnapshot.size} onaylı anı bulundu`);

        const testimonialsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data().authorName,
            text: doc.data().content,
            createdAt: doc.data().createdAt,
            date: doc.data().createdAt?.toDate().toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }))
          .sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return b.createdAt.seconds - a.createdAt.seconds;
          });

        console.log('📊 İşlenmiş:', testimonialsData);
        setMemories(testimonialsData);
      } catch (error) {
        console.error('❌ Hata:', error);
        setMemories([]);
      }
    };

    fetchMemories();
  }, [activeSection]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    const headerTimer = setTimeout(() => {
      setShowHeader(true);
    }, 1500);

    return () => {
      clearInterval(slideInterval);
      clearTimeout(headerTimer);
    };
  }, [slideImages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(t.blog.loginRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      // Firebase'e testimonial ekle
      const testimonialData = {
        authorName: formData.name || userData?.displayName,
        content: formData.memory,
        authorId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'testimonials'), testimonialData);

      // Email sistemi geçici olarak devre dışı - daha sonra eklenecek
      console.log('📧 Anı Firebase\'e kaydedildi, email sistemi daha sonra eklenecek');

      alert('Anınız başarıyla gönderildi ve admin onayı bekliyor!');
      setFormData({ name: '', memory: '' });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Hata oluştu! Lütfen tekrar deneyin.');
    }

    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveSection('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavItem = ({ section, label }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`px-2 py-3 sm:px-4 sm:py-4 text-xs sm:text-base font-semibold transition-all duration-300 whitespace-nowrap ${activeSection === section ? 'bg-slate-600 text-white' : 'bg-white text-gray-700 hover:bg-slate-100'
        }`}
    >
      {label}
    </button>
  );

  // Anı metnini kısalt - daha güvenli truncation
  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    
    // Son boşlukta kes, kelime ortasında kesme
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  };

  // Giriş yapmamışsa - Sadece Ana Sayfa ve Hakkında göster
  if (!user) {
    return (
      <>
        {/* Auth Modal */}
        {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}

        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 flex flex-col">
          {/* Header */}
          <header className={`bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 shadow-lg transition-all duration-1000 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <nav className="max-w-7xl mx-auto relative">
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex gap-2">
                  <button
                    onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                  >
                    {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
                  </button>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-green-500/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm"
                  >
                    <User size={18} />
                    {language === 'tr' ? 'Giriş Yap' : 'Login'}
                  </button>
                </div>
                <div className="flex justify-center items-center divide-x divide-white/20 pr-48">
                  <NavItem section="home" label={t.nav.home} />
                  <NavItem section="about" label={t.nav.about} />
                  <NavItem section="memorials" label={t.nav.memorials} />
                  <NavItem section="copyright" label={t.copyright.button} />
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <h1 className="text-white font-bold text-lg">Gökçe Önal</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                      className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-sm"
                    >
                      {language === 'tr' ? 'EN' : 'TR'}
                    </button>
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="text-white p-2"
                    >
                      {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
                </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />
                {/* Menu Content */}
                <div className="absolute top-full left-0 w-full bg-slate-700 shadow-lg z-50">
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        setActiveSection('home');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                        activeSection === 'home' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                      }`}
                    >
                      {t.nav.home}
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection('about');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                        activeSection === 'about' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                      }`}
                    >
                      {t.nav.about}
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection('memorials');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                        activeSection === 'memorials' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                      }`}
                    >
                      {t.nav.memorials}
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection('copyright');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                        activeSection === 'copyright' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                      }`}
                    >
                      {t.copyright.button}
                    </button>
                    <div className="p-4 border-t border-slate-600">
                      <button
                        onClick={() => {
                          setShowAuth(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <User size={18} />
                        {language === 'tr' ? 'Giriş Yap' : 'Login'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {/* Ana Sayfa */}
            {activeSection === 'home' && (
              <div className="animate-fadeIn">
                <div className="min-h-screen flex items-center justify-center">
                  <div className="max-w-4xl mx-auto text-center px-8">
                    <div className="inline-block relative mb-6">
                      <div className="flex items-center justify-center gap-10 md:gap-16">
                        <div className="hidden sm:block w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                          <img src={leftPhoto} alt="Left" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={48} className="text-slate-400" />
                          </div>
                        </div>

                        <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                          <img src={profileImage} alt="Gökçe Önal" className="w-full h-full object-cover" onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }} />
                          <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                            <User size={100} className="text-slate-400" />
                          </div>
                        </div>

                        <div className="hidden sm:block w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                          <img src={rightPhoto} alt="Right" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={48} className="text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <h1 className="text-5xl font-bold text-slate-800 mb-4">Gökçe Önal</h1>
                    <p className="text-3xl text-slate-600">(1988 - ∞)</p>
                  </div>
                </div>

                <div className="py-16 px-8">
                  <div className="max-w-5xl mx-auto">
                    <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                      {slideImages.map((img, index) => (
                        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                          <img src={img} alt={`Slayt ${index + 1}`} className="w-full h-full object-cover" onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }} />
                          <div className="w-full h-full bg-gradient-to-br from-sky-300 via-slate-200 to-sky-200 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={120} className="text-slate-400" strokeWidth={1} />
                            <span className="absolute bottom-8 text-2xl text-slate-600 font-semibold">Slayt {index + 1}</span>
                          </div>
                        </div>
                      ))}

                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                        {slideImages.map((_, index) => (
                          <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hakkında Sayfası */}
            {activeSection === 'about' && (
              <div className="animate-fadeIn py-20 px-8">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">
                    {language === 'tr' ? 'Hakkında' : 'About'}
                  </h2>

                  <div className="bg-white border-2 border-slate-200 rounded-lg p-10 shadow-xl mb-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8">
                      {language === 'tr' ? 'Gökçe Önal Kimdir?' : 'Who is Gökçe Önal?'}
                    </h3>

                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                      <div className="md:w-1/3">
                        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border-4 border-slate-200 shadow-lg">
                          <img src="./hakkinda.jpg" alt="Gökçe Önal" className="w-full h-full object-cover" onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }} />
                          <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                            <User size={80} className="text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <div className="md:w-2/3 space-y-4 text-gray-700 leading-relaxed">
                        <p>
                          {language === 'tr' ? (
                            <>
                              <strong>Gökçe Önal</strong>, 2011 yılında <strong>İstanbul Teknik Üniversitesi Mimarlık Fakültesi'nden</strong> mezun oldu. Eğitime duyduğu tutku ve mesleki alana katkı sunma arzusu onu <strong>Orta Doğu Teknik Üniversitesi'ne (ODTÜ)</strong> taşıdı. ODTÜ Mimarlık Fakültesi'nde <strong>yüksek lisans</strong> yaparken aynı zamanda <strong>araştırma görevlisi</strong> olarak görev aldı. Mimari tasarım stüdyoları, grafik iletişim ve yapı bilgisi gibi alanlarda eğitim vererek hem pratik hem de akademik bilgi birikimini genç kuşaklara aktardı. 2011 yılında düzenlenen 6. RAF Ürün Dergisi Kapak Tasarım Yarışması'na gönderdiği kapak tasarımı, 838 tasarım arasından seçilmiş, derginin 38. sayısının kapağında yer almıştır.
                            </>
                          ) : (
                            <>
                              <strong>Gökçe Önal</strong> graduated from <strong>Istanbul Technical University Faculty of Architecture</strong> in 2011. Her passion for education and desire to contribute to the professional field led her to <strong>Middle East Technical University (METU)</strong>. While pursuing her <strong>master's degree</strong> at METU Faculty of Architecture, she also served as a <strong>research assistant</strong>. She shared both practical and academic knowledge with younger generations by teaching in areas such as architectural design studios, graphic communication, and building information. In 2011, her cover design submitted to the 6th RAF Product Magazine Cover Design Competition was selected among 838 designs and featured on the cover of the 38th issue of the magazine.
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-4">
                          {language === 'tr' ? 'Akademik Kariyer' : 'Academic Career'}
                        </h4>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {language === 'tr' ? (
                            <>
                              Kariyerinin erken dönemlerinde kısa bir süre Ofis 16 Mimarlık çatısı altında mimari pratik deneyimi de yaşayan Gökçe, 2013 yılından sonra tamamen akademik çalışmalara yöneldi. Bu doğrultuda 2016 yılından itibaren Hollanda'nın prestijli üniversitelerinden biri olan TU Delft Mimarlık ve Yapılı Çevre Fakültesi'nde çeşitli dönemlerde yarı zamanlı eğitmen olarak çalıştı.
                            </>
                          ) : (
                            <>
                              In the early stages of her career, Gökçe also gained architectural practice experience under Ofis 16 Architecture for a short period. After 2013, she focused entirely on academic work. In this direction, from 2016 onwards, she worked as a part-time instructor at various times at TU Delft Faculty of Architecture and the Built Environment, one of the prestigious universities in the Netherlands.
                            </>
                          )}
                        </p>
                        <p className="text-gray-700 font-semibold mb-3">
                          {language === 'tr' ? 'TU Delft\'te yaptığı dersler ile;' : 'At TU Delft, she:'}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                          <li>{language === 'tr' ? 'Mimari tasarım stüdyoları yürüttü' : 'Led architectural design studios'}</li>
                          <li>{language === 'tr' ? 'Seçmeli dersler verdi' : 'Taught elective courses'}</li>
                          <li>{language === 'tr' ? 'Dijital ve çevrim içi eğitim içerikleri geliştirdi' : 'Developed digital and online educational content'}</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                          {language === 'tr' ? (
                            <>
                              Bu görevleri sayesinde Avrupa'daki akademik çevrelerde de tanınır hâle geldi.
                            </>
                          ) : (
                            <>
                              Through these roles, she became well-known in academic circles across Europe.
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-4">
                          {language === 'tr' ? 'Disiplinler Arası Bakış Açısı ve Editörlük Faaliyetleri' : 'Interdisciplinary Perspective and Editorial Activities'}
                        </h4>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {language === 'tr' ? (
                            <>
                              Gökçe Önal, mimarlığın yalnızca yapılarla değil, aynı zamanda <strong>toplum, teknoloji ve çevreyle</strong> doğrudan ilişkili olduğuna inanan bir akademisyendi. Bu nedenle <strong>2021 yılından itibaren Backchannels 4S Blog'da</strong> yardımcı editör olarak yer aldı. Sosyal bilimler ve STS (Science, Technology and Society) içerik hazırlayan bu platformda, <strong>disiplinler arası bakış açısını yaygınlaştırma</strong> amacı onun uluslararası mimarlık dünyasında da adından söz ettirmesini sağlamıştır.
                            </>
                          ) : (
                            <>
                              Gökçe Önal was an academic who believed that architecture is directly related not only to structures but also to <strong>society, technology, and the environment</strong>. For this reason, she served as an assistant editor at <strong>Backchannels 4S Blog from 2021 onwards</strong>. On this platform, which prepares content on social sciences and STS (Science, Technology and Society), her aim to <strong>promote an interdisciplinary perspective</strong> helped her gain recognition in the international architecture world.
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-4">
                          {language === 'tr' ? 'Kısa Bilgiler' : 'Quick Info'}
                        </h4>
                        <div className="space-y-2 text-gray-700">
                          <p><strong>{language === 'tr' ? 'Görev Aldığı Üniversiteler:' : 'Universities:'}</strong> {language === 'tr' ? "ODTÜ'de araştırma görevliliği, Hollanda'da TU Delft'te eğitmenlik." : "Research assistant at METU, instructor at TU Delft in the Netherlands."}</p>

                          <p><strong>{language === 'tr' ? 'Mezuniyet:' : 'Graduation:'}</strong> {language === 'tr' ? 'İTÜ Mimarlık Fakültesi (2011)' : 'ITU Faculty of Architecture (2011)'}</p>

                          <p><strong>{language === 'tr' ? 'Yüksek Lisans & Görev:' : 'Master & Position:'}</strong> {language === 'tr' ? 'ODTÜ Mimarlık Fakültesi, araştırma görevlisi' : 'METU Faculty of Architecture, research assistant'}</p>

                          <p><strong>{language === 'tr' ? 'Uluslararası Kariyer:' : 'International Career:'}</strong> {language === 'tr' ? 'TU Delft, Hollanda – yarı zamanlı eğitmen' : 'TU Delft, the Netherlands – part-time instructor'}</p>

                          <p><strong>{language === 'tr' ? 'Editörlük:' : 'Editorial:'}</strong> {language === 'tr' ? 'Backchannels 4S Blog yardımcı editörü' : 'Assistant editor at Backchannels 4S Blog'}</p>
                        </div>
                      </div>

                      {/* CV İndirme Bölümü */}
                      <div className="mt-8 pt-6 border-t-2 border-gray-200">
                        <div className="flex items-center justify-between">
                          <h4 className="text-2xl font-bold text-gray-800">
                            {language === 'tr' ? 'Özgeçmiş' : 'Curriculum Vitae'}
                          </h4>
                          <a
                            href="./gokce-onal-cv.pdf"
                            download="Gokce-Onal-CV.pdf"
                            className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <FileText size={16} />
                            {language === 'tr' ? 'CV İndir' : 'Download CV'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COPYRIGHT SECTION */}
            {activeSection === 'copyright' && (
              <div className="animate-fadeIn py-20 px-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white border-2 border-slate-200 rounded-lg p-12 shadow-2xl">
                    <div className="flex items-center justify-center mb-8">
                      <Scale size={60} className="text-slate-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-slate-800 text-center mb-8">
                      {t.copyright.title}
                    </h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {t.copyright.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MEMORIALS SECTION - Herkese Açık */}
            {activeSection === 'memorials' && (
              <div className="animate-fadeIn py-20 px-8">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">{t.memorials.title}</h2>

                  {!selectedMemorialCategory ? (
                    <div className="grid md:grid-cols-3 gap-8">
                      <div
                        onClick={() => setSelectedMemorialCategory('projects')}
                        className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                      >
                        <div className="aspect-video bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                          <img
                            src={memorialCategories.projects.coverImage}
                            alt="Projeler"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={100} className="text-slate-300" strokeWidth={1} />
                          </div>
                        </div>
                        <div className="p-6 text-center">
                          <h3 className="text-2xl font-bold text-gray-800">{t.memorials.projects}</h3>
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedMemorialCategory('awards')}
                        className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                      >
                        <div className="aspect-video bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                          <img
                            src={memorialCategories.awards.coverImage}
                            alt="Ödüller"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={100} className="text-slate-300" strokeWidth={1} />
                          </div>
                        </div>
                        <div className="p-6 text-center">
                          <h3 className="text-2xl font-bold text-gray-800">{t.memorials.awards}</h3>
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedMemorialCategory('drawings')}
                        className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                      >
                        <div className="aspect-video bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                          <img
                            src={memorialCategories.drawings.coverImage}
                            alt="Karakalem Çalışmaları"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={100} className="text-slate-300" strokeWidth={1} />
                          </div>
                        </div>
                        <div className="p-6 text-center">
                          <h3 className="text-2xl font-bold text-gray-800">{t.memorials.drawings}</h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setSelectedMemorialCategory(null)}
                        className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg"
                      >
                        ← {t.memorials.backToCategories}
                      </button>

                      <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">
                        {t.memorials[selectedMemorialCategory]}
                      </h3>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memorialCategories[selectedMemorialCategory].images.map((item, index) => (
                          <div key={index} className="group">
                            <div
                              onClick={() => setSelectedImage(item.src)}
                              className="aspect-square bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                            >
                              <img
                                src={item.src}
                                alt={`${t.memorials[selectedMemorialCategory]} ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                                <Image size={80} className="text-slate-300" strokeWidth={1} />
                              </div>
                            </div>
                            {item.caption && item.caption[language] && (
                              <div className="mt-3 text-center">
                                <p className="text-gray-700 font-medium text-sm bg-white/80 rounded-lg py-2 px-4 inline-block shadow-sm">
                                  {item.caption[language]}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* IMAGE MODAL - Giriş yapmamış kullanıcılar için */}
          {selectedImage && (
            <div
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Büyük görünüm"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Footer */}
          <footer className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white py-8">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-lg flex items-center gap-2">
                  {t.footer}
                  <Heart size={20} className="fill-white" />
                </p>
                <button
                  onClick={() => setActiveSection('copyright')}
                  className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all duration-300 border border-white/20"
                >
                  <Scale size={18} />
                  {t.copyright.button}
                </button>
              </div>
            </div>
          </footer>

          {/* IMAGE MODAL - Giriş yapmamış kullanıcılar için */}
          {selectedImage && (
            <div
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Büyük görünüm"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
            
            header {
              position: sticky;
              top: 0;
              z-index: 40;
            }
          `}</style>
        </div>
      </>
    );
  }

  // Onay bekleyenler için pending sayfası
  if (userData && !userData.approved && userData.role !== 'admin') {
    return <PendingApproval language={language} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 flex flex-col">
      <header className={`bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 shadow-lg transition-all duration-1000 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="max-w-7xl mx-auto relative">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex gap-2">
              <button
                onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
              >
                {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm"
                title={t.nav.logout}
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">{t.nav.logout}</span>
              </button>
            </div>
            <div className="flex justify-center items-center divide-x divide-white/20 pr-48 overflow-x-auto">
              <NavItem section="home" label={t.nav.home} />
              <NavItem section="about" label={t.nav.about} />

              {/* Sadece onaylı üyeler görebilir */}
              {userData?.approved && (
                <>
                  <NavItem section="memorials" label={t.nav.memorials} />
                  <NavItem section="gallery" label={t.nav.gallery} />
                  <NavItem section="blog" label={t.nav.blog} />
                  <NavItem section="news" label={t.nav.news} />
                </>
              )}

              {/* Sadece admin görebilir */}
              {userData?.role === 'admin' && (
                <NavItem section="admin" label={t.nav.admin} />
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-white font-bold text-lg">Gökçe Önal</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-sm"
                >
                  {language === 'tr' ? 'EN' : 'TR'}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-2"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />
                {/* Menu Content */}
                <div className="absolute top-full left-0 w-full bg-slate-700 shadow-lg z-50">
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        setActiveSection('home');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                        activeSection === 'home' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                      }`}
                    >
                      {t.nav.home}
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection('about');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                        activeSection === 'about' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                      }`}
                    >
                      {t.nav.about}
                    </button>

                    {/* Sadece onaylı üyeler görebilir */}
                    {userData?.approved && (
                      <>
                        <button
                          onClick={() => {
                            setActiveSection('memorials');
                            setMobileMenuOpen(false);
                          }}
                          className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                            activeSection === 'memorials' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                          }`}
                        >
                          {t.nav.memorials}
                        </button>
                        <button
                          onClick={() => {
                            setActiveSection('gallery');
                            setMobileMenuOpen(false);
                          }}
                          className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                            activeSection === 'gallery' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                          }`}
                        >
                          {t.nav.gallery}
                        </button>
                        <button
                          onClick={() => {
                            setActiveSection('blog');
                            setMobileMenuOpen(false);
                          }}
                          className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                            activeSection === 'blog' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                          }`}
                        >
                          {t.nav.blog}
                        </button>
                        <button
                          onClick={() => {
                            setActiveSection('news');
                            setMobileMenuOpen(false);
                          }}
                          className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                            activeSection === 'news' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                          }`}
                        >
                          {t.nav.news}
                        </button>
                      </>
                    )}

                    {/* Sadece admin görebilir */}
                    {userData?.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveSection('admin');
                          setMobileMenuOpen(false);
                        }}
                        className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${
                          activeSection === 'admin' ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                        }`}
                      >
                        {t.nav.admin}
                      </button>
                    )}

                    <div className="p-4 border-t border-slate-600">
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <LogOut size={18} />
                        {t.nav.logout}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Admin Paneli */}
        {activeSection === 'admin' && userData?.role === 'admin' && (
          <AdminPanel language={language} />
        )}

        {/* HOME SECTION */}
        {activeSection === 'home' && (
          <div className="animate-fadeIn">
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
              <div className="max-w-7xl mx-auto w-full">
                {/* Three-column layout for desktop, stacked for mobile */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 mb-8">

                  {/* Left Poster Photo */}
                  <div className="hidden lg:block flex-shrink-0">
                    <div className="w-48 xl:w-56 h-72 xl:h-80 rounded-lg overflow-hidden border-8 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <img src={leftPhoto} alt="Memory" className="w-full h-full object-cover" onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={60} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Center Profile Section */}
                  <div className="flex-shrink-0 text-center">
                    <div className="inline-block relative mb-6">
                      <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl mx-auto">
                        <img src={profileImage} alt="Gökçe Önal" className="w-full h-full object-cover" onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }} />
                        <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                          <User size={100} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Gökçe Önal</h1>
                    <p className="text-2xl md:text-3xl text-slate-600">(1988 - ∞)</p>

                    {/* Kullanıcı bilgisi */}
                    {userData && (
                      <div className="mt-8 inline-block bg-white/80 px-6 py-3 rounded-lg shadow-lg">
                        <p className="text-gray-700 font-semibold">
                          {t.auth.welcome}, <span className="text-slate-800">{userData.displayName}</span>
                          {userData.role === 'admin' && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">Admin</span>}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Poster Photo */}
                  <div className="hidden lg:block flex-shrink-0">
                    <div className="w-48 xl:w-56 h-72 xl:h-80 rounded-lg overflow-hidden border-8 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <img src={rightPhoto} alt="Memory" className="w-full h-full object-cover" onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={60} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile: Show poster photos below on small screens */}
                <div className="lg:hidden flex justify-center gap-6 mt-8">
                  <div className="w-36 h-52 rounded-lg overflow-hidden border-4 border-white shadow-xl">
                    <img src={leftPhoto} alt="Memory" className="w-full h-full object-cover" onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} />
                    <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                      <Image size={40} className="text-slate-400" />
                    </div>
                  </div>
                  <div className="w-36 h-52 rounded-lg overflow-hidden border-4 border-white shadow-xl">
                    <img src={rightPhoto} alt="Memory" className="w-full h-full object-cover" onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} />
                    <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                      <Image size={40} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-16 px-8">
              <div className="max-w-5xl mx-auto">
                <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                  {slideImages.map((img, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                      <img src={img} alt={`Slayt ${index + 1}`} className="w-full h-full object-cover" onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-300 via-slate-200 to-sky-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={120} className="text-slate-400" strokeWidth={1} />
                        <span className="absolute bottom-8 text-2xl text-slate-600 font-semibold">Slayt {index + 1}</span>
                      </div>
                    </div>
                  ))}

                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                    {slideImages.map((_, index) => (
                      <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT SECTION */}
        {activeSection === 'about' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">
                {language === 'tr' ? 'Hakkında' : 'About'}
              </h2>

              <div className="bg-white border-2 border-slate-200 rounded-lg p-10 shadow-xl mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">
                  {language === 'tr' ? 'Gökçe Önal Kimdir?' : 'Who is Gökçe Önal?'}
                </h3>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3">
                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border-4 border-slate-200 shadow-lg">
                      <img src="./hakkinda.jpg" alt="Gökçe Önal" className="w-full h-full object-cover" onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <User size={80} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="md:w-2/3 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      {language === 'tr' ? (
                        <>
                          <strong>Gökçe Önal</strong>, 2011 yılında <strong>İstanbul Teknik Üniversitesi Mimarlık Fakültesi'nden</strong> mezun oldu. Eğitime duyduğu tutku ve mesleki alana katkı sunma arzusu onu <strong>Orta Doğu Teknik Üniversitesi'ne (ODTÜ)</strong> taşıdı. ODTÜ Mimarlık Fakültesi'nde <strong>yüksek lisans</strong> yaparken aynı zamanda <strong>araştırma görevlisi</strong> olarak görev aldı. Mimari tasarım stüdyoları, grafik iletişim ve yapı bilgisi gibi alanlarda eğitim vererek hem pratik hem de akademik bilgi birikimini genç kuşaklara aktardı. 2011 yılında düzenlenen 6. RAF Ürün Dergisi Kapak Tasarım Yarışması'na gönderdiği kapak tasarımı, 838 tasarım arasından seçilmiş, derginin 38. sayısının kapağında yer almıştır.
                        </>
                      ) : (
                        <>
                          <strong>Gökçe Önal</strong> graduated from <strong>Istanbul Technical University Faculty of Architecture</strong> in 2011. Her passion for education and desire to contribute to the professional field led her to <strong>Middle East Technical University (METU)</strong>. While pursuing her <strong>master's degree</strong> at METU Faculty of Architecture, she also served as a <strong>research assistant</strong>. She shared both practical and academic knowledge with younger generations by teaching in areas such as architectural design studios, graphic communication, and building information. In 2011, her cover design submitted to the 6th RAF Product Magazine Cover Design Competition was selected among 838 designs and featured on the cover of the 38th issue of the magazine.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                      {language === 'tr' ? 'Akademik Kariyer' : 'Academic Career'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {language === 'tr' ? (
                        <>
                          Kariyerinin erken dönemlerinde kısa bir süre Ofis 16 Mimarlık çatısı altında mimari pratik deneyimi de yaşayan Gökçe, 2013 yılından sonra tamamen akademik çalışmalara yöneldi. Bu doğrultuda 2016 yılından itibaren Hollanda'nın prestijli üniversitelerinden biri olan TU Delft Mimarlık ve Yapılı Çevre Fakültesi'nde çeşitli dönemlerde yarı zamanlı eğitmen olarak çalıştı.
                        </>
                      ) : (
                        <>
                          In the early stages of her career, Gökçe also gained architectural practice experience under Ofis 16 Architecture for a short period. After 2013, she focused entirely on academic work. In this direction, from 2016 onwards, she worked as a part-time instructor at various times at TU Delft Faculty of Architecture and the Built Environment, one of the prestigious universities in the Netherlands.
                        </>
                      )}
                    </p>
                    <p className="text-gray-700 font-semibold mb-3">
                      {language === 'tr' ? 'TU Delft\'te yaptığı dersler ile;' : 'At TU Delft, she:'}
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>{language === 'tr' ? 'Mimari tasarım stüdyoları yürüttü' : 'Led architectural design studios'}</li>
                      <li>{language === 'tr' ? 'Seçmeli dersler verdi' : 'Taught elective courses'}</li>
                      <li>{language === 'tr' ? 'Dijital ve çevrim içi eğitim içerikleri geliştirdi' : 'Developed digital and online educational content'}</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      {language === 'tr' ? (
                        <>
                          Bu görevleri sayesinde Avrupa'daki akademik çevrelerde de tanınır hâle geldi.
                        </>
                      ) : (
                        <>
                          Through these roles, she became well-known in academic circles across Europe.
                        </>
                      )}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                      {language === 'tr' ? 'Disiplinler Arası Bakış Açısı ve Editörlük Faaliyetleri' : 'Interdisciplinary Perspective and Editorial Activities'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {language === 'tr' ? (
                        <>
                          Gökçe Önal, mimarlığın yalnızca yapılarla değil, aynı zamanda <strong>toplum, teknoloji ve çevreyle</strong> doğrudan ilişkili olduğuna inanan bir akademisyendi. Bu nedenle <strong>2021 yılından itibaren Backchannels 4S Blog'da</strong> yardımcı editör olarak yer aldı. Sosyal bilimler ve STS (Science, Technology and Society) içerik hazırlayan bu platformda, <strong>disiplinler arası bakış açısını yaygınlaştırma</strong> amacı onun uluslararası mimarlık dünyasında da adından söz ettirmesini sağlamıştır.
                        </>
                      ) : (
                        <>
                          Gökçe Önal was an academic who believed that architecture is directly related not only to structures but also to <strong>society, technology, and the environment</strong>. For this reason, she served as an assistant editor at <strong>Backchannels 4S Blog from 2021 onwards</strong>. On this platform, which prepares content on social sciences and STS (Science, Technology and Society), her aim to <strong>promote an interdisciplinary perspective</strong> helped her gain recognition in the international architecture world.
                        </>
                      )}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                      {language === 'tr' ? 'Kısa Bilgiler' : 'Quick Info'}
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>{language === 'tr' ? 'Görev Aldığı Üniversiteler:' : 'Universities:'}</strong> {language === 'tr' ? "ODTÜ'de araştırma görevliliği, Hollanda'da TU Delft'te eğitmenlik." : "Research assistant at METU, instructor at TU Delft in the Netherlands."}</p>

                      <p><strong>{language === 'tr' ? 'Mezuniyet:' : 'Graduation:'}</strong> {language === 'tr' ? 'İTÜ Mimarlık Fakültesi (2011)' : 'ITU Faculty of Architecture (2011)'}</p>

                      <p><strong>{language === 'tr' ? 'Yüksek Lisans & Görev:' : 'Master & Position:'}</strong> {language === 'tr' ? 'ODTÜ Mimarlık Fakültesi, araştırma görevlisi' : 'METU Faculty of Architecture, research assistant'}</p>

                      <p><strong>{language === 'tr' ? 'Uluslararası Kariyer:' : 'International Career:'}</strong> {language === 'tr' ? 'TU Delft, Hollanda – yarı zamanlı eğitmen' : 'TU Delft, the Netherlands – part-time instructor'}</p>

                      <p><strong>{language === 'tr' ? 'Editörlük:' : 'Editorial:'}</strong> {language === 'tr' ? 'Backchannels 4S Blog yardımcı editörü' : 'Assistant editor at Backchannels 4S Blog'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GALLERY SECTION - Sadece onaylı üyeler */}
        {activeSection === 'gallery' && userData?.approved && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">{t.gallery.title}</h2>

              {!selectedCategory ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <div
                    onClick={() => setSelectedCategory('childhood')}
                    className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-square bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={galleryCategories.childhood.coverImage}
                        alt="Çocukluk"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={80} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-semibold text-gray-800">{t.gallery.childhood}</h3>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedCategory('youth')}
                    className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-square bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={galleryCategories.youth.coverImage}
                        alt="Gençlik"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={80} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-semibold text-gray-800">{t.gallery.youth}</h3>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedCategory('adulthood')}
                    className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-square bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={galleryCategories.adulthood.coverImage}
                        alt="Yetişkinlik"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={80} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-semibold text-gray-800">{t.gallery.adulthood}</h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg"
                  >
                    ← {t.gallery.backToCategories}
                  </button>

                  <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">
                    {t.gallery[selectedCategory]}
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryCategories[selectedCategory].images.map((item, index) => (
                      <div key={index} className="group">
                        <div
                          onClick={() => setSelectedImage(item.src)}
                          className="aspect-square bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          <img
                            src={item.src}
                            alt={`${t.gallery[selectedCategory]} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={80} className="text-slate-300" strokeWidth={1} />
                          </div>
                        </div>
                        {item.caption && item.caption[language] && (
                          <div className="mt-3 text-center">
                            <p className="text-gray-700 font-medium text-sm bg-white/80 rounded-lg py-2 px-4 inline-block shadow-sm">
                              {item.caption[language]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BLOG (Testimonials/Anılar) SECTION - Genişletilebilir */}
        {activeSection === 'blog' && userData?.approved && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-5xl font-bold text-slate-800">{t.blog.title}</h2>
                <div className="text-sm text-gray-500">
                  📊 {memories.length} {language === 'tr' ? 'anı' : 'testimonial'}
                </div>
              </div>

              {/* Form - Anı Paylaş */}
              {user && userData?.approved && (
                <div className="bg-white border-2 border-slate-200 rounded-lg p-10 shadow-xl mb-16">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{t.blog.shareTitle}</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">{t.blog.nameLabel}</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors text-gray-800"
                        placeholder={t.blog.namePlaceholder}
                        defaultValue={userData?.displayName}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3">{t.blog.memoryLabel}</label>
                      <textarea
                        value={formData.memory}
                        onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                        rows="6"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors resize-none text-gray-800"
                        placeholder={t.blog.memoryPlaceholder}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.memory}
                      className="w-full bg-slate-600 hover:bg-slate-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      {isSubmitting ? t.blog.submitting : t.blog.submitButton}
                    </button>
                  </form>
                </div>
              )}

              {/* Onaylanmış anılar listesi - Genişletilebilir */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-800 mb-8">{t.blog.sharedTitle}</h3>

                {memories.length === 0 && (
                  <div className="text-center py-16">
                    <BookOpen size={60} className="mx-auto mb-4 opacity-30 text-gray-400" />
                    <p className="text-xl text-gray-500">{t.blog.noMemories}</p>
                  </div>
                )}

                {memories.length > 0 && memories.map((memory) => {
                  const isExpanded = expandedTestimonial === memory.id;
                  const shouldTruncate = memory.text.length > 200;
                  const displayText = isExpanded || !shouldTruncate 
                    ? memory.text 
                    : truncateText(memory.text, 200);

                  return (
                    <div
                      key={memory.id}
                      className="bg-white border-2 border-slate-200 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-slate-200">
                        <div className="flex items-center gap-3">
                          <User size={24} className="text-sky-600" />
                          <span className="font-bold text-xl text-gray-800">{memory.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar size={18} />
                          <span>{memory.date}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap mb-4 memory-text">
                        {displayText}
                      </p>

                      {shouldTruncate && (
                        <button
                          onClick={() => setExpandedTestimonial(isExpanded ? null : memory.id)}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-semibold transition-colors group"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={20} className="group-hover:transform group-hover:-translate-y-1 transition-transform" />
                              {t.blog.readLess}
                            </>
                          ) : (
                            <>
                              <ChevronDown size={20} className="group-hover:transform group-hover:translate-y-1 transition-transform" />
                              {t.blog.readMore}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MEMORIALS (Projeler-Ödüller-Karakalem) SECTION - Sadece onaylı üyeler */}
        {activeSection === 'memorials' && userData?.approved && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">{t.memorials.title}</h2>

              {!selectedMemorialCategory ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <div
                    onClick={() => setSelectedMemorialCategory('projects')}
                    className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-video bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={memorialCategories.projects.coverImage}
                        alt="Projeler"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={100} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-800">{t.memorials.projects}</h3>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedMemorialCategory('awards')}
                    className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-video bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={memorialCategories.awards.coverImage}
                        alt="Ödüller"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={100} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-800">{t.memorials.awards}</h3>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedMemorialCategory('drawings')}
                    className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-video bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={memorialCategories.drawings.coverImage}
                        alt="Karakalem Çalışmaları"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={100} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-800">{t.memorials.drawings}</h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedMemorialCategory(null)}
                    className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg"
                  >
                    ← {t.memorials.backToCategories}
                  </button>

                  <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">
                    {t.memorials[selectedMemorialCategory]}
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memorialCategories[selectedMemorialCategory].images.map((item, index) => (
                      <div key={index} className="group">
                        <div
                          onClick={() => setSelectedImage(item.src)}
                          className="aspect-square bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          <img
                            src={item.src}
                            alt={`${t.memorials[selectedMemorialCategory]} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={80} className="text-slate-300" strokeWidth={1} />
                          </div>
                        </div>
                        {item.caption && item.caption[language] && (
                          <div className="mt-3 text-center">
                            <p className="text-gray-700 font-medium text-sm bg-white/80 rounded-lg py-2 px-4 inline-block shadow-sm">
                              {item.caption[language]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NEWS SECTION - Sadece onaylı üyeler */}
        {activeSection === 'news' && userData?.approved && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">
                {language === 'tr' ? 'Basından Haberler' : 'Press News'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsData.map((item) => (
                  <a
                    key={item.id}
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={language === 'tr' ? item.title_tr : item.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div
                        className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        <Image size={80} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-slate-600 transition-colors mb-4">
                        {language === 'tr' ? item.title_tr : item.title_en}
                      </h3>
                      <p className="text-slate-600 flex items-center gap-2 font-medium">
                        {language === 'tr' ? 'Haberi oku' : 'Read article'} →
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COPYRIGHT SECTION */}
        {activeSection === 'copyright' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border-2 border-slate-200 rounded-lg p-12 shadow-2xl">
                <div className="flex items-center justify-center mb-8">
                  <Scale size={60} className="text-slate-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 text-center mb-8">
                  {t.copyright.title}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {t.copyright.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Büyük görünüm"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-lg flex items-center gap-2">
              {t.footer}
              <Heart size={20} className="fill-white" />
            </p>
            <button
              onClick={() => setActiveSection('copyright')}
              className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all duration-300 border border-white/20"
            >
              <Scale size={18} />
              {t.copyright.button}
            </button>
          </div>
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        
        header {
          position: sticky;
          top: 0;
          z-index: 40;
        }
        
        /* Metin taşma kontrolü */
        .memory-text {
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
        }
        
        /* Admin panel için tablo hücre genişliği */
        .admin-table-cell {
          max-width: 300px;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default MemorialWebsite;