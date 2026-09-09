import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEO from '../components/common/SEO';
import Marquee from '../components/common/Marquee';
import { FiStar, FiCheck, FiArrowRight, FiShield, FiPackage, FiHeart } from 'react-icons/fi';

// ── Curated Visual Collections / كروت التصنيفات البصرية ──
const CURATED_COLLECTIONS = [
  {
    id: 'evening',
    slug: 'bags',
    link: '/shop?category=bags',
    titleAr: 'شنط السهرة والمناسبات',
    titleEn: 'Evening & Occasion Bags',
    badge: 'بريق وفخامة السهرات',
    icon: '✨',
    tag: 'HAUTE LUXURY',
    desc: 'تصاميم لؤلؤية وكريستالية مصوغة بدقة متناهية لتمنحك إطلالة ملكية في كل مناسبة واحتفال.',
    image: '/images/categories/evening-bags.jpg',
  },
  {
    id: 'crossbody',
    slug: 'bags',
    link: '/shop?category=bags',
    titleAr: 'شنط الكاجوال والكروس',
    titleEn: 'Everyday Crossbody Bags',
    badge: 'عملية وأنيقة',
    icon: '🌸',
    tag: 'SIGNATURE PIECES',
    desc: 'شنط ناعمة خفيفة محبوكة بالخرز بعناية فائقة لتناسب طلتك اليومية، الجامعة، وخروجات الصديقات.',
    image: '/images/categories/crossbody-bags.jpg',
  },
  {
    id: 'jewelry',
    slug: 'jewelry',
    link: '/shop?category=jewelry',
    titleAr: 'الأساور والعقود والإكسسوارات',
    titleEn: 'Artisan Necklaces & Sets',
    badge: 'تفاصيل ناعمة',
    icon: '💎',
    tag: 'DELICATE DETAILS',
    desc: 'عقود وأساور لؤلؤية منسوجة حبة بحبة لتكمل حضورك الأنيق أو لتكون أرق هدية لأحبائك.',
    image: '/images/categories/jewelry-sets.jpg',
  },
];

// ── Customer Reviews & Social Proof / آراء العميلات ──
const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: 'سارة م.',
    city: 'القاهرة',
    product: 'شنطة سواريه لؤلؤ كلاسيك',
    rating: 5,
    date: 'منذ أسبوعين',
    avatar: 'س',
    text: 'الشنطة في الحقيقة خيال، لمعة الخرز وتقفيل الخيط متين جداً مش بيقطع، تسلم إيديكم! فخورة إن في براند مصري بالجودة والجمال ده.',
  },
  {
    id: 2,
    name: 'نورهان ع.',
    city: 'الإسكندرية',
    product: 'طلب تصميم مخصص (Custom Design)',
    rating: 5,
    date: 'منذ شهر',
    avatar: 'ن',
    text: 'طلبت ديزاين مخصوص لفرح أختي وطلع أحلى مما اتخيلت، الكل سألني عنها في القاعة.. والذوق في التعامل وسرعة الرد تجنن بجد!',
  },
  {
    id: 3,
    name: 'مريم ك.',
    city: 'الشيخ زايد',
    product: 'شنطة كروس كاجوال روز',
    rating: 5,
    date: 'منذ 3 أسابيع',
    avatar: 'م',
    text: 'التغليف لوحده يفتح النفس، كأنها جاية هدية من باريس، والشنطة ملمسها فاخر جداً وخفيفة في الشيل مع إنها متينة ومحبوكة صح.',
  },
  {
    id: 4,
    name: 'ياسمين ف.',
    city: 'المعادي',
    product: 'طقم عقد وأسورة خرز لؤلؤي',
    rating: 5,
    date: 'منذ أسبوع',
    avatar: 'ي',
    text: 'حقيقي فخورة إن ده شغل يدوي مصري، تفاصيل الحبات ووزن الشنطة وتناسق الألوان تحفة بجد. دي أول تجربة وأكيد مش هتكون الأخيرة!',
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getProducts({ limit: 4, sort: '-createdAt' }),
          categoryApi.getCategories()
        ]);

        const products = Array.isArray(productsRes.data)
          ? productsRes.data
          : (productsRes.data?.products || []);
        setFeaturedProducts(products);

        const cats = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : (categoriesRes.data?.categories || []);
        setCategories(cats.slice(0, 3));
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F1E8' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <SEO
        title="HABA | حَبّة — Made Bead by Bead"
        description="Handmade bags, necklaces & little pieces made with patience, detail and love. Made bead by bead."
        keywords="handmade, artisan, beaded bags, necklaces, HABA, حبة, Egyptian handmade"
      />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#F7F1E8', minHeight: '92vh' }}
      >
        <div className="flex flex-col lg:flex-row min-h-[92vh]">
          {/* ── Left: Text Content ── */}
          <div
            className="relative z-10 flex items-center"
            style={{ flex: '1 1 50%' }}
          >
            {/* Subtle decorative gradient */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
              <div
                className="absolute"
                style={{
                  left: '-60px', bottom: '-40px',
                  width: '280px', height: '280px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #C98B91 0%, transparent 70%)',
                  opacity: 0.12
                }}
              />
            </div>

            <div className="relative z-10 px-6 sm:px-10 lg:px-16 xl:px-24 py-20 lg:py-32 w-full">
              {/* Arabic hero tagline — same visual weight as English */}
              <h2
                className="font-heading font-medium"
                style={{
                  fontSize: 'clamp(32px, 5.5vw, 56px)',
                  color: '#C98B91',
                  lineHeight: 1.3,
                  marginBottom: '20px',
                  letterSpacing: '0.01em',
                }}
                dir="rtl"
              >
                حَبّة ورا حَبّة،
                <br />
                <span style={{ color: '#542A3A' }}>حكاية بتتعمل.</span>
              </h2>

              {/* English headline */}
              <h1
                className="font-heading"
                style={{
                  fontSize: 'clamp(38px, 6vw, 72px)',
                  color: '#292525',
                  lineHeight: 1.1,
                  fontWeight: 400,
                  marginBottom: '24px',
                }}
              >
                Made bead<br />
                <span style={{ fontStyle: 'italic', color: '#542A3A' }}>by bead.</span>
              </h1>

              <p
                className="font-body"
                style={{
                  fontSize: 'clamp(14px, 1.5vw, 17px)',
                  color: '#635751',
                  lineHeight: 1.8,
                  maxWidth: '440px',
                  marginBottom: '40px',
                }}
              >
                Handmade bags, necklaces & little pieces made with patience,
                <br className="hidden sm:block" /> detail and love.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center font-body font-medium tracking-widest uppercase transition-all"
                  style={{
                    backgroundColor: '#542A3A',
                    color: '#F7F1E8',
                    padding: '14px 32px',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    borderRadius: '3px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3d1e2a'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#542A3A'}
                >
                  Shop the Collection →
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center font-body font-medium tracking-widest uppercase transition-all"
                  style={{
                    border: '1px solid #542A3A',
                    color: '#542A3A',
                    padding: '14px 32px',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    borderRadius: '3px',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#542A3A'; e.currentTarget.style.color = '#F7F1E8'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#542A3A'; }}
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: Hero Lifestyle Image ── */}
          <div
            className="relative hidden lg:block"
            style={{ flex: '1 1 50%' }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/images/hero-lifestyle.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Left-edge gradient fade into ivory */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, #F7F1E8 0%, transparent 18%)',
              }}
            />
            {/* Bottom gradient fade */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, #F7F1E8 0%, transparent 12%)',
              }}
            />
          </div>

          {/* Mobile: show image as a banner below text */}
          <div className="block lg:hidden relative" style={{ height: '340px', overflow: 'hidden' }}>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/images/hero-lifestyle.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, #F7F1E8 0%, transparent 20%, transparent 80%, #F7F1E8 100%)',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Editorial Brand Marquee Ribbon / شريط البراند المتحرك ── */}
      <section
        className="relative overflow-hidden py-4 border-y select-none"
        style={{
          backgroundColor: '#292525',
          borderColor: '#3d1e2a',
        }}
      >
        <Marquee
          speed={48}
          itemClassName="font-heading text-lg sm:text-xl md:text-2xl text-[#F7F1E8] font-normal tracking-wide px-3"
          separator={<span className="mx-6 text-[#C5A56A] text-base select-none">✦</span>}
          items={[
            'HABA · حَبّة',
            'حَبّة ورا حَبّة، حكاية بتتعمل',
            'MADE BEAD BY BEAD',
            'صناعة يدوية فاخرة',
            'ARTISAN BEADWORK',
            'قطع فريدة ومميزة صُنعت لأجلك',
            'PATIENCE, DETAIL & LOVE',
            'تصاميم حصرية مصنوعة بحب',
          ]}
        />
      </section>

      {/* ── Shop by Collection (Visual Category Cards / كروت التصنيفات البصرية) ── */}
      <section
        style={{ backgroundColor: '#F7F1E8', paddingTop: '72px', paddingBottom: '96px' }}
        className="relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 rounded-full text-xs font-medium tracking-wide"
              style={{ backgroundColor: 'rgba(84, 42, 58, 0.08)', color: '#542A3A' }}
            >
              <span className="text-[#C5A56A] text-sm">✦</span>
              <span className="font-body font-semibold">مجموعات حَبّة الحصرية · Curated Collections</span>
            </div>
            <h2
              className="font-heading"
              style={{
                fontSize: 'clamp(28px, 4.5vw, 44px)',
                color: '#292525',
                fontWeight: 400,
                lineHeight: 1.25,
                marginBottom: '12px',
              }}
            >
              تسوقي حسب التشكيلة
            </h2>
            <p
              className="font-body text-sm sm:text-base"
              style={{ color: '#635751', lineHeight: 1.7 }}
            >
              قطع أصلية مفعمة بالأنوثة، صُممت ونُسجت حبة بحبة لتلائم سهراتك الخاصة وإطلالاتك اليومية.
            </p>
          </div>

          {/* 3 Visual Editorial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CURATED_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                to={col.link}
                className="group relative block overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500"
                style={{ height: '480px' }}
              >
                {/* Background Image with Zoom on Hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                  style={{
                    backgroundImage: `url(${col.image})`,
                  }}
                />

                {/* Dark Gradient Overlay for Readability */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(26, 18, 21, 0.94) 0%, rgba(26, 18, 21, 0.58) 45%, rgba(26, 18, 21, 0.1) 75%, rgba(26, 18, 21, 0.3) 100%)',
                  }}
                />

                {/* Top Badge */}
                <div className="absolute top-5 inset-x-5 flex justify-between items-center z-10">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide shadow-sm"
                    style={{
                      backgroundColor: 'rgba(247, 241, 232, 0.92)',
                      color: '#542A3A',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span>{col.icon}</span>
                    <span>{col.badge}</span>
                  </span>
                  <span
                    className="text-[11px] tracking-[0.18em] font-body uppercase px-2.5 py-0.5 rounded font-medium"
                    style={{
                      color: '#F7F1E8',
                      backgroundColor: 'rgba(0,0,0,0.38)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {col.tag}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 z-10 flex flex-col justify-end text-white">
                  <p
                    className="font-body text-xs tracking-[0.2em] uppercase mb-1 font-medium"
                    style={{ color: '#E8C7B8' }}
                  >
                    {col.titleEn}
                  </p>
                  <h3
                    className="font-heading mb-2 text-white group-hover:text-[#F7F1E8] transition-colors"
                    style={{
                      fontSize: 'clamp(22px, 2.4vw, 28px)',
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {col.titleAr}
                  </h3>
                  <p
                    className="font-body text-xs sm:text-[13px] line-clamp-2 mb-4 leading-relaxed"
                    style={{ color: 'rgba(247, 241, 232, 0.85)' }}
                  >
                    {col.desc}
                  </p>

                  {/* Explore Link */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/20">
                    <span
                      className="font-body text-xs tracking-widest uppercase font-medium transition-all group-hover:translate-x-1"
                      style={{ color: '#C5A56A' }}
                    >
                      تسوقي التشكيلة · Explore
                    </span>
                    <span
                      className="text-[#C5A56A] transition-transform group-hover:translate-x-1 text-sm"
                    >
                      ←
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section style={{ backgroundColor: '#fff', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#C5A56A' }}>
                Just Arrived
              </p>
              <h2 className="font-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#292525', fontWeight: 400 }}>
                New Pieces
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex font-body text-xs tracking-widest uppercase transition-colors"
              style={{ color: '#542A3A' }}
              onMouseEnter={e => e.currentTarget.style.color = '#3d1e2a'}
              onMouseLeave={e => e.currentTarget.style.color = '#542A3A'}
            >
              View All →
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-heading italic" style={{ fontSize: '22px', color: '#978572' }}>
                New pieces arriving soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Customer Reviews & Social Proof / آراء العميلات والتقييمات ── */}
      <section
        style={{ backgroundColor: '#FAF6F0', paddingTop: '88px', paddingBottom: '96px' }}
        className="relative overflow-hidden border-t border-[#EDE4D8]"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div
              className="inline-flex items-center gap-2 mb-3.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide"
              style={{ backgroundColor: 'rgba(197, 165, 106, 0.16)', color: '#7E5B1A' }}
            >
              <div className="flex text-[#C5A56A]">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-body font-semibold">تقييم 4.9 من 5 (أكثر من 150 عميلة سعيدة)</span>
            </div>

            <h2
              className="font-heading"
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                color: '#292525',
                fontWeight: 400,
                marginBottom: '12px',
              }}
            >
              ماذا تقول عميلات حَبّة؟
            </h2>
            <p
              className="font-body text-sm sm:text-base"
              style={{ color: '#635751', lineHeight: 1.8 }}
            >
              كل قطعة وراها قصة حب ورضا.. شاهدي انطباعات عميلاتنا بعد استلام قطعهن المصنوعة حبة بحبة.
            </p>
          </div>

          {/* Testimonials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-[#EDE4D8] relative group"
              >
                <div>
                  {/* Rating Stars & Verified Badge */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1 text-[#C5A56A]">
                      {[...Array(review.rating)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                    >
                      <FiCheck className="w-3 h-3" />
                      شراء مؤكد
                    </span>
                  </div>

                  {/* Quote Text */}
                  <p
                    className="font-body text-[14px] sm:text-[15px] leading-relaxed mb-6"
                    style={{ color: '#3A3335' }}
                    dir="rtl"
                  >
                    "{review.text}"
                  </p>
                </div>

                <div>
                  {/* Product Tag */}
                  <div
                    className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-md mb-4"
                    style={{ backgroundColor: '#F7F1E8', color: '#542A3A' }}
                  >
                    👜 {review.product}
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[#F0EAE1]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm font-semibold flex-shrink-0"
                      style={{
                        backgroundColor: '#542A3A',
                        color: '#F7F1E8',
                      }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-[#292525]">
                        {review.name}
                      </h4>
                      <p className="font-body text-xs text-[#978572]">
                        {review.city} · {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof Trust Pillars (Artisan Values) */}
          <div
            className="mt-16 pt-12 border-t grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            style={{ borderColor: '#E5DCD2' }}
          >
            <div className="p-3">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-xl shadow-xs" style={{ backgroundColor: '#F7F1E8' }}>
                🧵
              </div>
              <h4 className="font-heading text-base font-medium text-[#292525] mb-1">صناعة يدوية 100%</h4>
              <p className="font-body text-xs text-[#7A6E68]">كل حبة تُنسج بإتقان وصبر بأيدي حرفية مصرية</p>
            </div>

            <div className="p-3">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-xl shadow-xs" style={{ backgroundColor: '#F7F1E8' }}>
                ✨
              </div>
              <h4 className="font-heading text-base font-medium text-[#292525] mb-1">تفصيل حسب الطلب</h4>
              <p className="font-body text-xs text-[#7A6E68]">تخصيص كامل للألوان والمقاس والتصميم مع مساعدنا الذكي</p>
            </div>

            <div className="p-3">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-xl shadow-xs" style={{ backgroundColor: '#F7F1E8' }}>
                🎁
              </div>
              <h4 className="font-heading text-base font-medium text-[#292525] mb-1">تغليف فاخر للإهداء</h4>
              <p className="font-body text-xs text-[#7A6E68]">بوكس أنيق ومخملي مع كارت إهداء جاهز لأحبائك</p>
            </div>

            <div className="p-3">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-xl shadow-xs" style={{ backgroundColor: '#F7F1E8' }}>
                🛡️
              </div>
              <h4 className="font-heading text-base font-medium text-[#292525] mb-1">خيوط متينة تدوم</h4>
              <p className="font-body text-xs text-[#7A6E68]">تقفيل هندسي متماسك يحفظ شكل الشنطة ورونقها دائماً</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand CTA ── */}
      <section style={{ backgroundColor: '#542A3A', padding: '96px 16px', textAlign: 'center' }}>
        <div className="max-w-xl mx-auto">
          <p className="font-heading italic" style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', color: '#C98B91', marginBottom: '12px' }}>
            حَبّة ورا حَبّة،
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#F7F1E8', fontWeight: 400, lineHeight: 1.2, marginBottom: '20px' }}>
            A little piece,<br />
            <span style={{ fontStyle: 'italic' }}>made to be yours.</span>
          </h2>
          <p className="font-body" style={{ fontSize: '15px', color: '#C98B91', marginBottom: '36px', lineHeight: 1.8 }}>
            Every piece in HABA starts from a single bead.<br />
            Each one made slowly, with care, for you.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center font-body font-medium tracking-widest uppercase transition-all"
            style={{
              backgroundColor: '#F7F1E8',
              color: '#542A3A',
              padding: '14px 36px',
              fontSize: '12px',
              letterSpacing: '0.15em',
              borderRadius: '3px',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C5A56A'; e.currentTarget.style.color = '#F7F1E8'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F7F1E8'; e.currentTarget.style.color = '#542A3A'; }}
          >
            Shop the Collection →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
