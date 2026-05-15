// src/App.js
import React, { useState, useEffect } from 'react';
import { Heart, Image, BookOpen, User, Calendar, Scale, ChevronDown, ChevronUp, FileText, Menu, X } from 'lucide-react';

const MemorialWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [language, setLanguage] = useState('tr');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showHeader, setShowHeader] = useState(false);
  const [selectedMemorialCategory, setSelectedMemorialCategory] = useState(null);
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

  // -------------------------------------------------------
  // Anılar buraya eklenir — her obje: { id, name, text, date }
  // -------------------------------------------------------
  const memories = [


    {
        id: 1,
        name: 'Can Onal',
        text: "Gokcem,Bu dunyada kendimi  sansli hissettigim zamanlar oldu.Ama sanirim en sansli oldugum noktalardan biri, senin gibi guzel ruhlu, altin kalpli, zeki, sevgi dolu bir insanla buyumek, cocuklugumu gecirmek, senin kuzenim(daha cok kardesim) olman.Cocuklugumuz, beni sekillendirisin, en guzel zamanlarimizi paylasmamiz.Sana tesekkur etmek istiyorum, butun kalbimle.Seni ugurlamak kolay olmadi, hicbirimiz icin.Cok zordu Gokcem.Uzuntumuzu tarif etmek de oyle.Ama senin o guzel enerjin, bize, dogaya, bu dunyadaki zamaninda verdigin sevgi, hep bizimle.Burada, yanimizda.Sabaha kadar sohbetlerimiz, gulmelerimiz, okudugumuz kitaplar, izledigimiz filmler, Artur’da, Istanbul’da, Izmir’de, Milano’da, Paris’te, degisik sehirlerde, beraber gecirdigimiz sayisiz guzel an hep bizimle, hep yanimizda.Belki de zamanla bizi iyilestiricek sey de bu.Hikayelerimiz, anilarimiz ve hep hissettigimiz sonsuz sevgi.Tesekkurler Gokcem, paylastigimiz hersey icin, senin icin.Pinar ve benim ucuncu kardesimiz oldugun icin.Sen yeryuzunde bir guzel ruhlu armagandin bize, simdi de ismin gibi gokyuzunde guzel ruhlu bir armagansin.Bizi o isil isil kalbinle, o guzel gulumsemenle izliyorsun.Seni cok seviyoruz, isiklar icinde uyu canim Gokcem, kuzenim, kardesim ✨",
        date: '23 Haziran 2025'
      },
    // Örnek:
    // {
    //   id: 1,
    //   name: 'Ahmet Yılmaz',
    //   text: 'Gökçe ile ODTÜ\'deki yıllarımız...',
    //   date: '10 Mayıs 2025'
    // },
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
        sharedTitle: 'Paylaşılan Anılar',
        noMemories: 'Henüz anı eklenmemiş.',
        readMore: 'Devamını Oku',
        readLess: 'Daha Az Göster'
      },
      copyright: {
        button: 'Telif Hakkı',
        title: 'Telif Hakkı Bildirimi',
        content: 'Bu web sitesi üzerindeki tüm resim ve yazı içerikleri, Gökçe Önal ailesine aittir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında korunmaktadır. Sitemizde yer alan metinler, görseller, videolar ve diğer tüm materyaller, izinsiz olarak kopyalanamaz, dağıtılamaz veya kullanılamaz. Web sitemizi ziyaret ettiğiniz için teşekkür ederiz. İçeriklerimize saygı göstermeniz, hem yasal haklarımızı korumamızı, hem de Gökçe Önal\'a saygı gösterilmesini sağlayacaktır.',
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
        sharedTitle: 'Shared Memories',
        noMemories: 'No memories added yet.',
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
        { src: './music-1.jpg', caption: ''},
        { src: './music-2.jpg', caption: ''},
        { src: './music-3.jpg', caption: ''},
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
        { src: './karakalem1.jpg' },
        { src: './karakalem2.jpg' },
        { src: './karakalem3.jpg' },
        { src: './karakalem4.jpg' },
        { src: './karakalem5.jpg' },
        { src: './karakalem6.jpg' },
        { src: './karakalem7.jpg' },
        { src: './karakalem8.jpg' },
        { src: './karakalem9.jpg' },
        { src: './karakalem10.jpg' },
        { src: './karakalem11.jpg' },
        { src: './karakalem12.jpg' },
        { src: './karakalem13.jpg' },
        { src: './karakalem14.jpg' },
        { src: './karakalem15.jpg' },
        { src: './karakalem16.jpg' }
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

  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    return truncated + '...';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 flex flex-col">
      {/* HEADER */}
      <header className={`bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 shadow-lg transition-all duration-1000 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="max-w-7xl mx-auto relative">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
              >
                {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
              </button>
            </div>
            <div className="flex justify-center items-center divide-x divide-white/20 pr-32">
              <NavItem section="home" label={t.nav.home} />
              <NavItem section="about" label={t.nav.about} />
              <NavItem section="memorials" label={t.nav.memorials} />
              <NavItem section="gallery" label={t.nav.gallery} />
              <NavItem section="blog" label={t.nav.blog} />
              <NavItem section="news" label={t.nav.news} />
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

            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute top-full left-0 w-full bg-slate-700 shadow-lg z-50">
                  <div className="flex flex-col">
                    {[
                      { section: 'home', label: t.nav.home },
                      { section: 'about', label: t.nav.about },
                      { section: 'memorials', label: t.nav.memorials },
                      { section: 'gallery', label: t.nav.gallery },
                      { section: 'blog', label: t.nav.blog },
                      { section: 'news', label: t.nav.news },
                      { section: 'copyright', label: t.copyright.button },
                    ].map(({ section, label }) => (
                      <button
                        key={section}
                        onClick={() => { setActiveSection(section); setMobileMenuOpen(false); }}
                        className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${activeSection === section ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* MAIN */}
      <main className="flex-1">

        {/* HOME */}
        {activeSection === 'home' && (
          <div className="animate-fadeIn">
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
              <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 mb-8">
                  <div className="hidden lg:block flex-shrink-0">
                    <div className="w-48 xl:w-56 h-72 xl:h-80 rounded-lg overflow-hidden border-8 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <img src={leftPhoto} alt="Memory" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={60} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-center">
                    <div className="inline-block relative mb-6">
                      <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl mx-auto">
                        <img src={profileImage} alt="Gökçe Önal" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                          <User size={100} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Gökçe Önal</h1>
                    <p className="text-2xl md:text-3xl text-slate-600">(1988 - ∞)</p>
                  </div>

                  <div className="hidden lg:block flex-shrink-0">
                    <div className="w-48 xl:w-56 h-72 xl:h-80 rounded-lg overflow-hidden border-8 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <img src={rightPhoto} alt="Memory" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={60} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:hidden flex justify-center gap-6 mt-8">
                  {[leftPhoto, rightPhoto].map((photo, i) => (
                    <div key={i} className="w-36 h-52 rounded-lg overflow-hidden border-4 border-white shadow-xl">
                      <img src={photo} alt="Memory" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={40} className="text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="py-16 px-8">
              <div className="max-w-5xl mx-auto">
                <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                  {slideImages.map((img, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                      <img src={img} alt={`Slayt ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-300 via-slate-200 to-sky-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={120} className="text-slate-400" strokeWidth={1} />
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

        {/* ABOUT */}
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
                      <img src="./hakkinda.jpg" alt="Gökçe Önal" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <User size={80} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      {language === 'tr' ? (
                        <><strong>Gökçe Önal</strong>, 2011 yılında <strong>İstanbul Teknik Üniversitesi Mimarlık Fakültesi'nden</strong> mezun oldu. Eğitime duyduğu tutku ve mesleki alana katkı sunma arzusu onu <strong>Orta Doğu Teknik Üniversitesi'ne (ODTÜ)</strong> taşıdı. ODTÜ Mimarlık Fakültesi'nde <strong>yüksek lisans</strong> yaparken aynı zamanda <strong>araştırma görevlisi</strong> olarak görev aldı. Mimari tasarım stüdyoları, grafik iletişim ve yapı bilgisi gibi alanlarda eğitim vererek hem pratik hem de akademik bilgi birikimini genç kuşaklara aktardı. 2011 yılında düzenlenen 6. RAF Ürün Dergisi Kapak Tasarım Yarışması'na gönderdiği kapak tasarımı, 838 tasarım arasından seçilmiş, derginin 38. sayısının kapağında yer almıştır.</>
                      ) : (
                        <><strong>Gökçe Önal</strong> graduated from <strong>Istanbul Technical University Faculty of Architecture</strong> in 2011. Her passion for education and desire to contribute to the professional field led her to <strong>Middle East Technical University (METU)</strong>. While pursuing her <strong>master's degree</strong> at METU Faculty of Architecture, she also served as a <strong>research assistant</strong>. She shared both practical and academic knowledge with younger generations by teaching in areas such as architectural design studios, graphic communication, and building information. In 2011, her cover design submitted to the 6th RAF Product Magazine Cover Design Competition was selected among 838 designs and featured on the cover of the 38th issue of the magazine.</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">{language === 'tr' ? 'Akademik Kariyer' : 'Academic Career'}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {language === 'tr'
                        ? 'Kariyerinin erken dönemlerinde kısa bir süre Ofis 16 Mimarlık çatısı altında mimari pratik deneyimi de yaşayan Gökçe, 2013 yılından sonra tamamen akademik çalışmalara yöneldi. Bu doğrultuda 2016 yılından itibaren Hollanda\'nın prestijli üniversitelerinden biri olan TU Delft Mimarlık ve Yapılı Çevre Fakültesi\'nde çeşitli dönemlerde yarı zamanlı eğitmen olarak çalıştı.'
                        : 'In the early stages of her career, Gökçe also gained architectural practice experience under Ofis 16 Architecture for a short period. After 2013, she focused entirely on academic work. From 2016 onwards, she worked as a part-time instructor at TU Delft Faculty of Architecture and the Built Environment, one of the prestigious universities in the Netherlands.'}
                    </p>
                    <p className="text-gray-700 font-semibold mb-3">{language === 'tr' ? 'TU Delft\'te yaptığı dersler ile;' : 'At TU Delft, she:'}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>{language === 'tr' ? 'Mimari tasarım stüdyoları yürüttü' : 'Led architectural design studios'}</li>
                      <li>{language === 'tr' ? 'Seçmeli dersler verdi' : 'Taught elective courses'}</li>
                      <li>{language === 'tr' ? 'Dijital ve çevrim içi eğitim içerikleri geliştirdi' : 'Developed digital and online educational content'}</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      {language === 'tr' ? 'Bu görevleri sayesinde Avrupa\'daki akademik çevrelerde de tanınır hâle geldi.' : 'Through these roles, she became well-known in academic circles across Europe.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">{language === 'tr' ? 'Disiplinler Arası Bakış Açısı ve Editörlük Faaliyetleri' : 'Interdisciplinary Perspective and Editorial Activities'}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {language === 'tr'
                        ? 'Gökçe Önal, mimarlığın yalnızca yapılarla değil, aynı zamanda toplum, teknoloji ve çevreyle doğrudan ilişkili olduğuna inanan bir akademisyendi. Bu nedenle 2021 yılından itibaren Backchannels 4S Blog\'da yardımcı editör olarak yer aldı.'
                        : 'Gökçe Önal was an academic who believed that architecture is directly related not only to structures but also to society, technology, and the environment. For this reason, she served as an assistant editor at Backchannels 4S Blog from 2021 onwards.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">{language === 'tr' ? 'Kısa Bilgiler' : 'Quick Info'}</h4>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>{language === 'tr' ? 'Mezuniyet:' : 'Graduation:'}</strong> {language === 'tr' ? 'İTÜ Mimarlık Fakültesi (2011)' : 'ITU Faculty of Architecture (2011)'}</p>
                      <p><strong>{language === 'tr' ? 'Yüksek Lisans & Görev:' : 'Master & Position:'}</strong> {language === 'tr' ? 'ODTÜ Mimarlık Fakültesi, araştırma görevlisi' : 'METU Faculty of Architecture, research assistant'}</p>
                      <p><strong>{language === 'tr' ? 'Uluslararası Kariyer:' : 'International Career:'}</strong> {language === 'tr' ? 'TU Delft, Hollanda – yarı zamanlı eğitmen' : 'TU Delft, the Netherlands – part-time instructor'}</p>
                      <p><strong>{language === 'tr' ? 'Editörlük:' : 'Editorial:'}</strong> {language === 'tr' ? 'Backchannels 4S Blog yardımcı editörü' : 'Assistant editor at Backchannels 4S Blog'}</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-bold text-gray-800">{language === 'tr' ? 'Özgeçmiş' : 'Curriculum Vitae'}</h4>
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

        {/* MEMORIALS */}
        {activeSection === 'memorials' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">{t.memorials.title}</h2>
              {!selectedMemorialCategory ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {['projects', 'awards', 'drawings'].map((cat) => (
                    <div
                      key={cat}
                      onClick={() => setSelectedMemorialCategory(cat)}
                      className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img src={memorialCategories[cat].coverImage} alt={t.memorials[cat]} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                          <Image size={100} className="text-slate-300" strokeWidth={1} />
                        </div>
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="text-2xl font-bold text-gray-800">{t.memorials[cat]}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedMemorialCategory(null)} className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg">
                    ← {t.memorials.backToCategories}
                  </button>
                  <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">{t.memorials[selectedMemorialCategory]}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memorialCategories[selectedMemorialCategory].images.map((item, index) => (
                      <div key={index} className="group">
                        <div onClick={() => setSelectedImage(item.src)} className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                          <img src={item.src} alt={`${t.memorials[selectedMemorialCategory]} ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={80} className="text-slate-300" strokeWidth={1} />
                          </div>
                        </div>
                        {item.caption && item.caption[language] && (
                          <div className="mt-3 text-center">
                            <p className="text-gray-700 font-medium text-sm bg-white/80 rounded-lg py-2 px-4 inline-block shadow-sm">{item.caption[language]}</p>
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

        {/* GALLERY */}
        {activeSection === 'gallery' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">{t.gallery.title}</h2>
              {!selectedCategory ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {['childhood', 'youth', 'adulthood'].map((cat) => (
                    <div
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img src={galleryCategories[cat].coverImage} alt={t.gallery[cat]} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                          <Image size={80} className="text-slate-300" strokeWidth={1} />
                        </div>
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="text-2xl font-semibold text-gray-800">{t.gallery[cat]}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedCategory(null)} className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg">
                    ← {t.gallery.backToCategories}
                  </button>
                  <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">{t.gallery[selectedCategory]}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryCategories[selectedCategory].images.map((item, index) => (
                      <div key={index} className="group">
                        <div onClick={() => setSelectedImage(item.src)} className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                          <img src={item.src} alt={`${t.gallery[selectedCategory]} ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                            <Image size={80} className="text-slate-300" strokeWidth={1} />
                          </div>
                        </div>
                        {item.caption && item.caption[language] && (
                          <div className="mt-3 text-center">
                            <p className="text-gray-700 font-medium text-sm bg-white/80 rounded-lg py-2 px-4 inline-block shadow-sm">{item.caption[language]}</p>
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

        {/* BLOG / TESTIMONIALS */}
        {activeSection === 'blog' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 mb-16">{t.blog.title}</h2>
              <div className="space-y-6">
                {memories.length === 0 && (
                  <div className="text-center py-16">
                    <BookOpen size={60} className="mx-auto mb-4 opacity-30 text-gray-400" />
                    <p className="text-xl text-gray-500">{t.blog.noMemories}</p>
                  </div>
                )}
                {memories.map((memory) => {
                  const isExpanded = expandedTestimonial === memory.id;
                  const shouldTruncate = memory.text.length > 200;
                  const displayText = isExpanded || !shouldTruncate ? memory.text : truncateText(memory.text, 200);
                  return (
                    <div key={memory.id} className="bg-white border-2 border-slate-200 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300">
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
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap mb-4 memory-text">{displayText}</p>
                      {shouldTruncate && (
                        <button
                          onClick={() => setExpandedTestimonial(isExpanded ? null : memory.id)}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-semibold transition-colors group"
                        >
                          {isExpanded
                            ? <><ChevronUp size={20} />{t.blog.readLess}</>
                            : <><ChevronDown size={20} />{t.blog.readMore}</>}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* NEWS */}
        {activeSection === 'news' && (
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
                    className="group bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.imageUrl} alt={language === 'tr' ? item.title_tr : item.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
                        <Image size={80} className="text-slate-300" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-slate-600 transition-colors mb-4">
                        {language === 'tr' ? item.title_tr : item.title_en}
                      </h3>
                      <p className="text-slate-600 font-medium">{language === 'tr' ? 'Haberi oku' : 'Read article'} →</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COPYRIGHT */}
        {activeSection === 'copyright' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border-2 border-slate-200 rounded-lg p-12 shadow-2xl">
                <div className="flex items-center justify-center mb-8">
                  <Scale size={60} className="text-slate-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 text-center mb-8">{t.copyright.title}</h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{t.copyright.content}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10">×</button>
          <img src={selectedImage} alt="Büyük görünüm" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        header { position: sticky; top: 0; z-index: 40; }
        .memory-text {
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default MemorialWebsite;