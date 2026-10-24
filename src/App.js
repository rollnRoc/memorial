// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Image, BookOpen, User, Calendar, Scale, ChevronDown, ChevronUp, FileText, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const MemorialWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [language, setLanguage] = useState('tr');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMemorialCategory, setSelectedMemorialCategory] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  // Modal — index tabanlı navigasyon
  const [currentImageList, setCurrentImageList] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  const profileImage = './1st-photo.jpg';
  const slideImages = ['./slayt1.jpg', './slayt2.jpg', './slayt3.jpg'];

  // -------------------------------------------------------
  // Anılar — her obje: { id, name, text, date }
  // -------------------------------------------------------


  // -------------------------------------------------------
  // Anısına etkinlikleri
  // Fotoğraf dosyalarını public klasörüne ekleyip isimlerini buraya yazın
  // -------------------------------------------------------
  const eventsData = [
    {
      id: 'odtu-anma',
      title_tr: 'Gökçe Önal Yüksek Lisans Tez Ödül ve Anma Programı',
      title_en: "Gökçe Önal Master's Thesis Award and Memorial Program",
      subtitle_tr: 'ODTÜ Mimarlık Fakültesi Amfisi',
      subtitle_en: 'METU Faculty of Architecture Amphitheater',
      coverImage: './left-photo.jpg',
      images: [
        './odtu-anma1.jpg',
        './odtu-anma2.jpg',
        './odtu-anma3.jpg',
        './odtu-anma4.jpg',
      ]
    },
    {
      id: 'anitkabir',
      title_tr: 'Anıtkabir Toplu Ziyareti',
      title_en: 'Group Visit to Anıtkabir',
      subtitle_tr: '',
      subtitle_en: '',
      date: '',
      coverImage: './anitkabir.jpg',
      images: [
        './anitkabir.jpg',
      ]
    },
    {
      id: 'ani-yazilari',
      title_tr: 'Anı Yazıları',
      title_en: 'Memorial Writings',
      subtitle_tr: '',
      subtitle_en: '',
      date: '',
      coverImage: './beyond5.jpg',
      images: [
        './aniyazi-1.jpg',
        './aniyazi-2.jpg',
        './aniyazi-3.jpg',
        './aniyazi-4.jpg',
        './aniyazi-5.jpg',
        './aniyazi-6.jpg',
        './aniyazi-7.jpg',
        './aniyazi-8.jpg',
        './aniyazi-9.jpg',
        './aniyazi-10.jpg',
        './aniyazi-11.jpg',
        './aniyazi-12.jpg',
        './aniyazi-13.jpg',
        './aniyazi-14.jpg',
        './aniyazi-15.jpg',
        './aniyazi-16.jpg',
        './aniyazi-17.jpg',
        './aniyazi-18.jpg',
        './aniyazi-19.jpg',
        './aniyazi-20.jpg',
        './aniyazi-21.jpg',
        './aniyazi-22.jpg',
        './aniyazi-23.jpg',
        './aniyazi-24.jpg',
        './aniyazi-25.jpg',
        './aniyazi-26.jpg',
        './aniyazi-27.jpg',
        './aniyazi-28.jpg',
        './aniyazi-29.jpg',
        './aniyazi-30.jpg',
        './aniyazi-31.jpg',
        './aniyazi-32.jpg',
        './aniyazi-33.jpg',
        './aniyazi-34.jpg',
        './aniyazi-35.jpg',
        './aniyazi-36.jpg',
        './aniyazi-37.jpg',
        './aniyazi-38.jpg',
        './aniyazi-40.jpg',
        './aniyazi-41.jpg',
        './aniyazi-42.jpg',
        './aniyazi-43.jpg',
        './aniyazi-44.jpg',
        './aniyazi-45.jpg',
        './aniyazi-46.jpg',
        './aniyazi-47.jpg',
        './aniyazi-48.jpg',
        './aniyazi-49.jpg',
        './aniyazi-50.jpg',
        './aniyazi-51.jpg',
        './aniyazi-52.jpg',
        './aniyazi-53.jpg',
        './aniyazi-54.jpg',
        './aniyazi-55.jpg',
        './aniyazi-56.jpg',
        './aniyazi-57.jpg',
        './aniyazi-58.jpg',
        './aniyazi-59.jpg',
        './aniyazi-60.jpg',

      ]
    },
  ];

  const translations = {
    tr: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkında',
        memorials: 'Projeler - Ödüller',
        gallery: 'Hatıralar',
        news: 'Basından Haberler',
        anisina: 'Anısına',
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
        publications: 'Yayınlar',
        readPdf: 'Oku',
        downloadPdf: 'İndir',
        backToCategories: 'Kategorilere Dön'
      },
      anisina: {
        title: 'Anısına',
        subtitle: "Gökçe'nin anısına düzenlenen etkinlikler",
        backToEvents: '← Etkinliklere Dön',
        photoCount: 'fotoğraf',
      },
      copyright: {
        button: 'Telif Hakkı',
        title: 'Telif Hakkı Bildirimi',
        content: "Bu web sitesi üzerindeki tüm resim ve yazı içerikleri, Gökçe Önal ailesine aittir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında korunmaktadır. Sitemizde yer alan metinler, görseller, videolar ve diğer tüm materyaller, izinsiz olarak kopyalanamaz, dağıtılamaz veya kullanılamaz. Web sitemizi ziyaret ettiğiniz için teşekkür ederiz. İçeriklerimize saygı göstermeniz, hem yasal haklarımızı korumamızı, hem de Gökçe Önal'a saygı gösterilmesini sağlayacaktır.",
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
        news: 'Press News',
        anisina: 'In Her Memory',
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
        publications: 'Publications',
        readPdf: 'Read',
        downloadPdf: 'Download',
        backToCategories: 'Back to Categories'
      },
      anisina: {
        title: 'In Her Memory',
        subtitle: 'Events organized in memory of Gökçe',
        backToEvents: '← Back to Events',
        photoCount: 'photos',
      },
      copyright: {
        button: 'Copyright',
        title: 'Copyright Notice',
        content: 'All images and written content on this website belong to the family of Gökçe Önal and are protected under the Turkish Law No. 5846 on Intellectual and Artistic Works. All texts, images, videos, and other materials on this site cannot be copied, distributed, or used without permission. Thank you for visiting our website.',
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
        { src: './cocukluk1.jpg', caption: '' }, { src: './cocukluk2.jpg', caption: '' },
        { src: './cocukluk3.jpg', caption: '' }, { src: './cocukluk4.jpg', caption: '' },
        { src: './cocukluk5.jpg', caption: '' }, { src: './cocukluk6.jpg', caption: '' },
        { src: './cocukluk7.jpg', caption: '' }, { src: './cocukluk8.jpg', caption: '' },
        { src: './cocukluk9.jpg', caption: '' }, { src: './cocukluk10.jpg', caption: '' },
        { src: './cocukluk11.jpg', caption: '' }, { src: './cocukluk12.jpg', caption: '' }
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
        { src: './genclik7.jpg', caption: '' }, { src: './genclik8.jpg', caption: '' },
        { src: './genclik9.jpg', caption: '' }
      ]
    },
    adulthood: {
      coverImage: './slayt3.jpg',
      images: [
        { src: './yetiskin1.jpg', caption: '' }, { src: './yetiskin2.jpg', caption: '' },
        { src: './yetiskin3.jpg', caption: { tr: 'İstanbul Maratonu, Kasım 2021', en: 'Istanbul Marathon, November 2021' } },
        { src: './yetiskin4.jpg', caption: { tr: 'Mısır, Mart 2023', en: 'Egypt, March 2023' } },
        { src: './yetiskin5.jpg', caption: { tr: 'Mısır, Mart 2023', en: 'Egypt, March 2023' } },
        { src: './music-1.jpg', caption: '' }, { src: './music-2.jpg', caption: '' },
        { src: './music-3.jpg', caption: '' },
      ]
    }
  };

  const memorialCategories = {
    projects: {
      coverImage: './panel-1.jpg',
      images: [
        { src: './proje-calisma(tahta).jpg' }, { src: './proje-sunum1.jpg' },
        { src: './proje-sunum2.jpg' }, { src: './panel-2.jpg' }
      ]
    },
    awards: {
      coverImage: './ataturk-award.jpg',
      images: [
        { src: './elemantary-award.jpg' }, { src: './gencmimar-award.jpg' },
        { src: './kocSchool-award.jpg' }, { src: './music-award.jpg' },
        { src: './raf.jpg' }, { src: './izocam.jpg' }, { src: './left-photo.jpg' }
      ]
    },
    drawings: {
      coverImage: './proje-calisma(resim).jpg',
      images: [
        { src: './karakalem1.jpg' }, { src: './karakalem2.jpg' }, { src: './karakalem3.jpg' },
        { src: './karakalem4.jpg' }, { src: './karakalem5.jpg' }, { src: './karakalem6.jpg' },
        { src: './karakalem7.jpg' }, { src: './karakalem8.jpg' }, { src: './karakalem9.jpg' },
        { src: './karakalem10.jpg' }, { src: './karakalem11.jpg' }, { src: './karakalem12.jpg' },
        { src: './karakalem13.jpg' }, { src: './karakalem14.jpg' }, { src: './karakalem15.jpg' },
        { src: './karakalem16.jpg' }
      ]
    },
    publications: {
      coverImage: './yayinlar-cover.jpg',
      images: [],
      pdf: './The-Aesthetics-of-Machine-Vision.pdf',
      pdfStartPage: 13,
      chapterTitle: 'Environmental Sensing',
      citation_tr: 'The Aesthetics of Machine Vision: Critical Terms and Ideas · MIT Press, 2026 · Bölüm 15',
      citation_en: 'The Aesthetics of Machine Vision: Critical Terms and Ideas · MIT Press, 2026 · Chapter 15',
      text_tr: [
        'İki yıl önce kaleme alıp gönderdiği “Environmental Sensing” başlıklı çalışması, bugün dünyanın saygın üniversite yayınevlerinden MIT Press tarafından yayımlanan The Aesthetics of Machine Vision: Critical Terms and Ideas adlı kitapta, 15. bölüm olarak yer aldı. Gökçe’nin adı artık bu değerli eserin sayfalarında, akademik dünyada ve gelecek kuşaklara aktarılacak bir çalışmanın içinde yaşamaya devam ediyor.',
        'Çalışmasında; makinelerin çevreyi nasıl algıladığını, sensörlerin dünyayı nasıl ölçüp görünür ve anlamlandırılabilir hâle getirdiğini ve bu teknolojilerin çevremizi görme, bilme ve şekillendirme biçimlerimizi nasıl değiştirdiğini sorguluyor.',
        'Gökçemiz yaşamıyla olduğu kadar, ürettikleriyle de iz bırakmaya devam ediyor. Aramızdan ayrıldı ama ışığı, kelimeleri ve eserleri yaşamaya devam ediyor. Ve biz, onunla her zaman gurur duyacağız. ❤️'
      ],
      text_en: [
        'Her work “Environmental Sensing,” written and submitted two years ago, now appears as Chapter 15 of The Aesthetics of Machine Vision: Critical Terms and Ideas, published by MIT Press, one of the world’s most respected university presses. Gökçe’s name now lives on in the pages of this valuable volume, in the academic world, and in a work that will be passed on to future generations.',
        'In this work, she examines how machines perceive the environment, how sensors measure the world and render it visible and intelligible, and how these technologies change the ways we see, know, and shape our surroundings.',
        'Our Gökçe continues to leave her mark through what she created, as much as through the life she lived. She has left us, but her light, her words, and her work live on. And we will always be proud of her. ❤️'
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

  // -------------------------------------------------------
  // Modal helpers
  // -------------------------------------------------------
  const openImage = (list, index) => {
    setCurrentImageList(list);
    setSelectedImageIndex(index);
    window.history.pushState({ type: 'modal' }, '');
  };

  const closeImage = useCallback(() => {
    setSelectedImageIndex(null);
    setCurrentImageList([]);
  }, []);

  const navigateImage = useCallback((dir) => {
    setSelectedImageIndex(prev => {
      if (prev === null) return null;
      const next = prev + dir;
      if (next < 0) return currentImageList.length - 1;
      if (next >= currentImageList.length) return 0;
      return next;
    });
  }, [currentImageList.length]);

  // Klavye
  useEffect(() => {
    const onKey = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') navigateImage(1);
      else if (e.key === 'ArrowLeft') navigateImage(-1);
      else if (e.key === 'Escape') closeImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedImageIndex, navigateImage, closeImage]);
  useEffect(() => {
    const handlePopState = () => {
      if (selectedImageIndex !== null) {
        closeImage();
      } else if (selectedCategory) {
        setSelectedCategory(null);
      } else if (selectedMemorialCategory) {
        setSelectedMemorialCategory(null);
      } else if (selectedEventId) {
        setSelectedEventId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedImageIndex, selectedCategory, selectedMemorialCategory, selectedEventId, closeImage]);

  // Swipe
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigateImage(diff > 0 ? 1 : -1);
    setTouchStartX(null);
  };

  useEffect(() => {
    const si = setInterval(() => setCurrentSlide(p => (p + 1) % slideImages.length), 5000);
    const ht = setTimeout(() => setShowHeader(true), 1500);
    return () => { clearInterval(si); clearTimeout(ht); };
  }, [slideImages.length]);

  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    const t = text.substring(0, maxLength);
    const i = t.lastIndexOf(' ');
    return (i > maxLength * 0.8 ? t.substring(0, i) : t) + '...';
  };

  const NavItem = ({ section, label }) => (
    <button onClick={() => setActiveSection(section)}
      className={`px-2 py-3 sm:px-4 sm:py-4 text-xs sm:text-base font-semibold transition-all duration-300 whitespace-nowrap ${activeSection === section ? 'bg-slate-600 text-white' : 'bg-white text-gray-700 hover:bg-slate-100'
        }`}>
      {label}
    </button>
  );

  const navItems = [
    { section: 'home', label: t.nav.home },
    { section: 'about', label: t.nav.about },
    { section: 'memorials', label: t.nav.memorials },
    { section: 'gallery', label: t.nav.gallery },
    { section: 'news', label: t.nav.news },
    { section: 'anisina', label: t.nav.anisina },
  ];

  const imgFallback = (e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; };
  const Placeholder = ({ size = 80 }) => (
    <div className="w-full h-full bg-gradient-to-br from-sky-100 via-slate-50 to-sky-50 flex items-center justify-center" style={{ display: 'none' }}>
      <Image size={size} className="text-slate-300" strokeWidth={1} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 flex flex-col">

      {/* HEADER */}
      <header className={`bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 shadow-lg transition-all duration-1000 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="max-w-7xl mx-auto relative">
          <div className="hidden md:block">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <button onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm">
                {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
              </button>
            </div>
            <div className="flex justify-center items-center divide-x divide-white/20 pr-32">
              {navItems.map(({ section, label }) => <NavItem key={section} section={section} label={label} />)}
            </div>
          </div>
          <div className="md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-white font-bold text-lg">Gökçe Önal</h1>
              <div className="flex items-center gap-2">
                <button onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-sm">
                  {language === 'tr' ? 'EN' : 'TR'}
                </button>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
            {mobileMenuOpen && (
              <>
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
                <div className="absolute top-full left-0 w-full bg-slate-700 shadow-lg z-50">
                  <div className="flex flex-col">
                    {navItems.map(({ section, label }) => (
                      <button key={section} onClick={() => { setActiveSection(section); setMobileMenuOpen(false); }}
                        className={`px-4 py-3 text-left font-semibold border-b border-slate-600 ${activeSection === section ? 'bg-slate-600 text-white' : 'text-white hover:bg-slate-600'}`}>
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

      <main className="flex-1">

        {/* HOME */}
        {activeSection === 'home' && (
          <div className="animate-fadeIn">
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
              <div className="text-center">
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl mx-auto mb-8">
                  <img src={profileImage} alt="Gökçe Önal" className="w-full h-full object-cover" onError={imgFallback} />
                  <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 items-center justify-center" style={{ display: 'none' }}>
                    <User size={100} className="text-slate-400" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Gökçe Önal</h1>
                <p className="text-2xl md:text-3xl text-slate-600">(1988 - ∞)</p>
              </div>
            </div>
            <div className="py-16 px-8">
              <div className="max-w-5xl mx-auto">
                <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                  {slideImages.map((img, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                      <img src={img} alt={`Slayt ${i + 1}`} className="w-full h-full object-cover" onError={imgFallback} />
                      <Placeholder size={120} />
                    </div>
                  ))}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                    {slideImages.map((_, i) => (
                      <button key={i} onClick={() => setCurrentSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`} />
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
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">{language === 'tr' ? 'Hakkında' : 'About'}</h2>
              <div className="bg-white border-2 border-slate-200 rounded-lg p-10 shadow-xl mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">{language === 'tr' ? 'Gökçe Önal Kimdir?' : 'Who is Gökçe Önal?'}</h3>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3">
                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border-4 border-slate-200 shadow-lg">
                      <img src="./hakkinda.jpg" alt="Gökçe Önal" className="w-full h-full object-cover" onError={imgFallback} />
                      <div className="w-full h-full bg-gradient-to-br from-sky-200 to-slate-200 flex items-center justify-center" style={{ display: 'none' }}>
                        <User size={80} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      {language === 'tr' ? (
                        <><strong>Gökçe Önal</strong>, 2011 yılında <strong>İstanbul Teknik Üniversitesi Mimarlık Fakültesi'nden</strong> mezun oldu. Eğitime duyduğu tutku ve mesleki alana katkı sunma arzusu onu <strong>Orta Doğu Teknik Üniversitesi'ne (ODTÜ)</strong> taşıdı. ODTÜ Mimarlık Fakültesi'nde <strong>yüksek lisans</strong> yaparken aynı zamanda <strong>araştırma görevlisi</strong> olarak görev aldı. 2011 yılında düzenlenen 6. RAF Ürün Dergisi Kapak Tasarım Yarışması'na gönderdiği kapak tasarımı, 838 tasarım arasından seçilmiş, derginin 38. sayısının kapağında yer almıştır.</>
                      ) : (
                        <><strong>Gökçe Önal</strong> graduated from <strong>Istanbul Technical University Faculty of Architecture</strong> in 2011. Her passion for education led her to <strong>Middle East Technical University (METU)</strong>, where she pursued her <strong>master's degree</strong> and served as a <strong>research assistant</strong>. In 2011, her cover design for the 6th RAF Product Magazine Cover Design Competition was selected among 838 designs.</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">{language === 'tr' ? 'Akademik Kariyer' : 'Academic Career'}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {language === 'tr'
                        ? "Kariyerinin erken dönemlerinde kısa bir süre Ofis 16 Mimarlık çatısı altında mimari pratik deneyimi de yaşayan Gökçe, 2013 yılından sonra tamamen akademik çalışmalara yöneldi. 2016 yılından itibaren Hollanda'nın prestijli üniversitelerinden biri olan TU Delft Mimarlık ve Yapılı Çevre Fakültesi'nde çeşitli dönemlerde yarı zamanlı eğitmen olarak çalıştı."
                        : "After a brief period in architectural practice at Ofis 16 Architecture, Gökçe focused entirely on academic work from 2013. From 2016 onwards, she worked as a part-time instructor at TU Delft Faculty of Architecture and the Built Environment in the Netherlands."}
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>{language === 'tr' ? 'Mimari tasarım stüdyoları yürüttü' : 'Led architectural design studios'}</li>
                      <li>{language === 'tr' ? 'Seçmeli dersler verdi' : 'Taught elective courses'}</li>
                      <li>{language === 'tr' ? 'Dijital ve çevrim içi eğitim içerikleri geliştirdi' : 'Developed digital and online educational content'}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">{language === 'tr' ? 'Editörlük' : 'Editorial Activities'}</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {language === 'tr'
                        ? "2021 yılından itibaren Backchannels 4S Blog'da yardımcı editör olarak görev aldı. Sosyal bilimler ve STS (Science, Technology and Society) içerik hazırlayan bu platformda disiplinler arası bakış açısını yaygınlaştırmayı hedefledi."
                        : "From 2021 onwards, she served as an assistant editor at Backchannels 4S Blog, a platform focused on social sciences and STS (Science, Technology and Society)."}
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
                  <div className="mt-8 pt-6 border-t-2 border-gray-200 flex items-center justify-between">
                    <h4 className="text-2xl font-bold text-gray-800">{language === 'tr' ? 'Özgeçmiş' : 'Curriculum Vitae'}</h4>
                    <a href="./gokce-onal-cv.pdf" download="Gokce-Onal-CV.pdf"
                      className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md">
                      <FileText size={16} />
                      {language === 'tr' ? 'CV İndir' : 'Download CV'}
                    </a>
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
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {['projects', 'awards', 'drawings', 'publications'].map((cat) => (
                    <div key={cat} onClick={() => { setSelectedMemorialCategory(cat); window.history.pushState({ type: 'memorial' }, ''); }}
                      className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                      <div className="aspect-video overflow-hidden">
                        <img src={memorialCategories[cat].coverImage} alt={t.memorials[cat]} className="w-full h-full object-cover" onError={imgFallback} />
                        <Placeholder size={100} />
                      </div>
                      <div className="p-6 text-center"><h3 className="text-2xl font-bold text-gray-800">{t.memorials[cat]}</h3></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedMemorialCategory(null)} className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all shadow-lg">
                    ← {t.memorials.backToCategories}
                  </button>
                  <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">{t.memorials[selectedMemorialCategory]}</h3>
                  {selectedMemorialCategory === 'publications' ? (() => {
                    const pub = memorialCategories.publications;
                    const pdfUrl = `${pub.pdf}#page=${pub.pdfStartPage}`;
                    return (
                      <div className="max-w-4xl mx-auto">
                        <div className="bg-white border-2 border-slate-200 rounded-xl shadow-xl p-8 md:p-10">
                          <p className="text-sm text-slate-500 mb-2">{pub[`citation_${language}`]}</p>
                          <h4 className="text-3xl font-bold text-gray-800 mb-6">{pub.chapterTitle}</h4>
                          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                            {pub[`text_${language}`].map((para, idx) => <p key={idx}>{para}</p>)}
                          </div>
                          <div className="flex flex-wrap gap-4 mt-8">
                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md">
                              <BookOpen size={18} />
                              {t.memorials.readPdf}
                            </a>
                            <a href={pub.pdf} download="The-Aesthetics-of-Machine-Vision.pdf"
                              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 px-6 py-3 rounded-lg font-semibold transition-all shadow-md">
                              <FileText size={18} />
                              {t.memorials.downloadPdf}
                            </a>
                          </div>
                        </div>
                        <iframe
                          title={pub.chapterTitle}
                          src={pdfUrl}
                          className="hidden md:block w-full h-[85vh] mt-8 rounded-xl border-2 border-slate-200 bg-white shadow-lg"
                        />
                      </div>
                    );
                  })() : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memorialCategories[selectedMemorialCategory].images.map((item, i) => {
                      const list = memorialCategories[selectedMemorialCategory].images.map(x => x.src);
                      return (
                        <div key={i} onClick={() => openImage(list, i)}
                          className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                          <img src={item.src} alt={`${t.memorials[selectedMemorialCategory]} ${i + 1}`} className="w-full h-full object-cover" onError={imgFallback} />
                          <Placeholder />
                        </div>
                      );
                    })}
                  </div>
                  )}
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
                    <div key={cat} onClick={() => { setSelectedCategory(cat); window.history.pushState({ type: 'gallery' }, ''); }}
                      className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                      <div className="aspect-square overflow-hidden">
                        <img src={galleryCategories[cat].coverImage} alt={t.gallery[cat]} className="w-full h-full object-cover" onError={imgFallback} />
                        <Placeholder />
                      </div>
                      <div className="p-6 text-center"><h3 className="text-2xl font-semibold text-gray-800">{t.gallery[cat]}</h3></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedCategory(null)} className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all shadow-lg">
                    ← {t.gallery.backToCategories}
                  </button>
                  <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">{t.gallery[selectedCategory]}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryCategories[selectedCategory].images.map((item, i) => {
                      const list = galleryCategories[selectedCategory].images.map(x => x.src);
                      return (
                        <div key={i}>
                          <div onClick={() => openImage(list, i)}
                            className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                            <img src={item.src} alt={`${t.gallery[selectedCategory]} ${i + 1}`} className="w-full h-full object-cover" onError={imgFallback} />
                            <Placeholder />
                          </div>
                          {item.caption && item.caption[language] && (
                            <div className="mt-3 text-center">
                              <p className="text-gray-700 font-medium text-sm bg-white/80 rounded-lg py-2 px-4 inline-block shadow-sm">{item.caption[language]}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* NEWS */}
        {activeSection === 'news' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-16">{language === 'tr' ? 'Basından Haberler' : 'Press News'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newsData.map((item) => (
                  <a key={item.id} href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="group bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.imageUrl} alt={language === 'tr' ? item.title_tr : item.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={imgFallback} />
                      <Placeholder />
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

        {/* ANISINA */}
        {activeSection === 'anisina' && (
          <div className="animate-fadeIn py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-800 text-center mb-3">{t.anisina.title}</h2>
              <p className="text-center text-slate-500 mb-16 text-lg">{t.anisina.subtitle}</p>

              {!selectedEventId ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {eventsData.map((event) => (
                    <div key={event.id} onClick={() => { setSelectedEventId(event.id); window.history.pushState({ type: 'event' }, ''); }}
                      className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col">
                      <div className="aspect-video overflow-hidden relative">
                        <img src={event.coverImage} alt={language === 'tr' ? event.title_tr : event.title_en}
                          className={`w-full h-full object-cover ${event.id === 'ani-yazilari' ? 'object-bottom' : ''}`} onError={imgFallback} />
                        <Placeholder />

                      </div>
                      <div className="p-6 flex flex-col items-center text-center flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{language === 'tr' ? event.title_tr : event.title_en}</h3>
                        {(language === 'tr' ? event.subtitle_tr : event.subtitle_en) && (
                          <p className="text-slate-500 text-sm mb-2">{language === 'tr' ? event.subtitle_tr : event.subtitle_en}</p>
                        )}
                        {event.date && (
                          <div className="flex items-center gap-2 text-slate-500 text-sm mt-3">
                            <Calendar size={15} /><span>{event.date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (() => {
                const event = eventsData.find(e => e.id === selectedEventId);
                if (!event) return null;
                return (
                  <div>
                    <button onClick={() => setSelectedEventId(null)} className="mb-8 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all shadow-lg">
                      {t.anisina.backToEvents}
                    </button>
                    <div className="text-center mb-12">
                      <h3 className="text-3xl font-bold text-slate-800 mb-2">{language === 'tr' ? event.title_tr : event.title_en}</h3>
                      {(language === 'tr' ? event.subtitle_tr : event.subtitle_en) && (
                        <p className="text-slate-500 text-lg">{language === 'tr' ? event.subtitle_tr : event.subtitle_en}</p>
                      )}
                      {event.date && (
                        <div className="flex items-center justify-center gap-2 text-slate-500 mt-2">
                          <Calendar size={16} /><span>{event.date}</span>
                        </div>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {event.images.map((src, i) => (
                        <div key={i} onClick={() => openImage(event.images, i)}
                          className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                          <img src={src} alt={`${language === 'tr' ? event.title_tr : event.title_en} ${i + 1}`}
                            className="w-full h-full object-cover" onError={imgFallback} />
                          <Placeholder />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

      </main>

      {/* IMAGE MODAL — klavye (←→ Esc) + swipe */}
      {selectedImageIndex !== null && currentImageList.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fadeIn"
          onClick={closeImage} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <button onClick={closeImage}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10 w-10 h-10 flex items-center justify-center">×</button>
          {currentImageList.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
              {selectedImageIndex + 1} / {currentImageList.length}
            </div>
          )}
          {currentImageList.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all z-10">
              <ChevronLeft size={32} />
            </button>
          )}
          <img src={currentImageList[selectedImageIndex]} alt="Büyük görünüm"
            className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} />
          {currentImageList.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all z-10">
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}

      {/* COPYRIGHT MODAL */}
      {activeSection === 'copyright' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveSection('home')}>
          <div className="bg-white rounded-xl p-10 max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center mb-6"><Scale size={48} className="text-slate-600" /></div>
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">{t.copyright.title}</h2>
            <p className="text-gray-700 leading-relaxed">{t.copyright.content}</p>
            <button onClick={() => setActiveSection('home')}
              className="mt-8 w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-all">
              {t.copyright.close}
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-lg flex items-center gap-2">
              {t.footer} <Heart size={20} className="fill-white" />
            </p>
            <button onClick={() => setActiveSection('copyright')}
              className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all border border-white/20">
              <Scale size={18} /> {t.copyright.button}
            </button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        header { position: sticky; top: 0; z-index: 40; }
        .memory-text { word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; hyphens: auto; max-width: 100%; }
      `}</style>
    </div>
  );
};

export default MemorialWebsite;