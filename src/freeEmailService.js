const WEB3FORMS_ACCESS_KEY = 'cc7658c0-e6f5-4928-b434-640f3ec8a89e'; 

// Admin email listesi
const ADMIN_EMAILS = [
    'yuemyi@gmail.com',
    
];

// Web3Forms ile HTML form yaklaşımı (CORS yok!)
const sendEmailViaWeb3Forms = async (subject, message, adminEmail) => {
    console.log(`📧 Sending email to: ${adminEmail} via HTML form method`);

    try {
        // Invisible form oluştur
        const form = document.createElement('form');
        form.action = 'https://api.web3forms.com/submit';
        form.method = 'POST';
        form.style.display = 'none';

        // Form alanları ekle
        const fields = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: subject,
            message: message,
            email: adminEmail,
            from_name: 'Gokce Onal Ani Sitesi',
            _redirect: 'javascript:void(0)', // Redirect engelle
            _captcha: 'false'
        };

        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        });

        // Form'u sayfaya ekle ve submit et
        document.body.appendChild(form);

        console.log('📧 HTML form prepared, submitting...');

        // Promise ile form submit'i handle et
        return new Promise((resolve) => {
            // Form submit'ten sonra kaldır
            setTimeout(() => {
                document.body.removeChild(form);
                console.log(`✅ Email form submitted for: ${adminEmail}`);
                resolve({ success: true });
            }, 1000);

            form.submit();
        });

    } catch (error) {
        console.error(`❌ Email error for ${adminEmail}:`, error);
        return { success: false, error };
    }
};

// Tüm admin'lere email gönder
const sendToAllAdmins = async (subject, message) => {
    const promises = ADMIN_EMAILS.map(adminEmail =>
        sendEmailViaWeb3Forms(subject, message, adminEmail)
    );

    await Promise.all(promises);
};

// Yeni kullanıcı email bildirimi
export const sendUserRegistrationEmail = async (userData) => {
    const subject = `🔔 Yeni Kullanıcı Kaydı - ${userData.displayName}`;
    const message = `
Merhaba Admin,

Gökçe Önal Anı Sitesi'ne yeni bir kullanıcı kaydı yapıldı:

👤 İsim: ${userData.displayName}
📧 Email: ${userData.email}
📅 Kayıt Tarihi: ${new Date().toLocaleDateString('tr-TR')}
🕒 Kayıt Saati: ${new Date().toLocaleTimeString('tr-TR')}

Kullanıcı admin onayı bekliyor.

Admin paneline gitmek için: https://gokceonal.com/#admin

---
Bu email otomatik gönderilmiştir.
Gökçe Önal Anı Sitesi - ${new Date().toLocaleString('tr-TR')}
`;

    try {
        await sendToAllAdmins(subject, message);
        console.log('🎉 User registration emails sent to all admins');
        return { success: true };
    } catch (error) {
        console.error('❌ User registration email failed:', error);
        return { success: false, error };
    }
};

// Yeni anı email bildirimi
export const sendTestimonialEmail = async (testimonialData, userData) => {
    const subject = `💭 Yeni Anı Paylaşıldı - ${testimonialData.authorName}`;
    const message = `
Merhaba Admin,

Gökçe Önal Anı Sitesi'ne yeni bir anı paylaşıldı:

✍️ Yazar: ${testimonialData.authorName}
📧 Email: ${userData?.email || 'Bilinmiyor'}
📅 Paylaşım Tarihi: ${new Date().toLocaleDateString('tr-TR')}
🕒 Paylaşım Saati: ${new Date().toLocaleTimeString('tr-TR')}

📝 Anı İçeriği:
"${testimonialData.content.length > 300
            ? testimonialData.content.substring(0, 300) + '...'
            : testimonialData.content}"

${testimonialData.content.length > 300
            ? `\nToplam ${testimonialData.content.length} karakter (kısaltılmış görünüm)`
            : ''}

Anı admin onayı bekliyor.

İncelemek için admin paneline git: https://gokceonal.com/#admin

---
Bu email otomatik gönderilmiştir.
Gökçe Önal Anı Sitesi - ${new Date().toLocaleString('tr-TR')}
`;

    try {
        await sendToAllAdmins(subject, message);
        console.log('🎉 Testimonial emails sent to all admins');
        return { success: true };
    } catch (error) {
        console.error('❌ Testimonial email failed:', error);
        return { success: false, error };
    }
};

// Test email
export const sendTestEmail = async () => {
    const subject = '🧪 Test Email - Sistem Çalışıyor';
    const message = `
Merhaba Admin,

Bu bir test emailidir.

✅ Email sistemi düzgün çalışıyor!

📊 Bu email ${ADMIN_EMAILS.length} admin'e gönderildi:
${ADMIN_EMAILS.map(email => `• ${email}`).join('\n')}

Test Zamanı: ${new Date().toLocaleString('tr-TR')}

---
Bu email otomatik gönderilmiştir.
Gökçe Önal Anı Sitesi
`;

    try {
        await sendToAllAdmins(subject, message);
        console.log('🎉 Test emails sent to all admins');
        return { success: true };
    } catch (error) {
        console.error('❌ Test email failed:', error);
        return { success: false, error };
    }
};