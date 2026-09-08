import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiStar, FiAward, FiArrowRight } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Marquee from '../components/common/Marquee';
import { settingsApi } from '../services/api';
import { formatWhatsAppNumber } from '../utils/whatsapp';

const About = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(import.meta.env.VITE_WHATSAPP_NUMBER || '');

  useEffect(() => {
    settingsApi.getSettings()
      .then(res => {
        if (res.data?.whatsappNumber) {
          setWhatsappNumber(res.data.whatsappNumber);
        }
      })
      .catch(console.error);
  }, []);

  const formattedPhone = formatWhatsAppNumber(whatsappNumber);
  const whatsappUrl = formattedPhone
    ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن تصميم خاص من حَبّة (HABA)')}`
    : `https://wa.me/?text=${encodeURIComponent('مرحباً، أود الاستفسار عن تصميم خاص من حَبّة (HABA)')}`;
  const brandHighlights = [
    {
      icon: <FiClock className="w-6 h-6" style={{ color: '#C5A56A' }} />,
      enTitle: 'Slow Craftsmanship',
      arTitle: 'صناعة متأنية وصبورة',
      enDesc: 'Hours of dedicated hand-threading for every single piece. We refuse rushed mass production.',
      arDesc: 'ساعات من العمل اليدوي الدقيق لكل قطعة منفردة. نؤمن أن الجمال الحقيقي لا يمكن استعجاله.',
    },
    {
      icon: <FiHeart className="w-6 h-6" style={{ color: '#C98B91' }} />,
      enTitle: '100% Handcrafted With Love',
      arTitle: 'صُنع بحب وإتقان ١٠٠٪',
      enDesc: 'Every bead is chosen, aligned, and tightly locked by hand to create durable heirlooms of art.',
      arDesc: 'نلضم كل خرزة بعناية فائقة وتناسق فريد لتكون قطعتك تحفة فنية تدوم وترافق لحظاتك الخاصة.',
    },
    {
      icon: <FiStar className="w-6 h-6" style={{ color: '#C5A56A' }} />,
      enTitle: 'Affordable Artisan Luxury',
      arTitle: 'فخامة أصيلة في متناول يدك',
      enDesc: 'Elevated statement designs made accessible without compromising authentic luxury quality.',
      arDesc: 'تصاميم لافتة وراقية تمنحك إحساس الفخامة الأصيلة بجودة استثنائية وبأسعار مدروسة.',
    },
  ];

  const marqueeWords = [
    'حَبّة ورا حَبّة، حكاية بتتعمل',
    'MADE BEAD BY BEAD',
    'HANDMADE IN EGYPT · صُنع يدوي بمصر',
    'PATIENCE & DEVOTION · صبر وإتقان',
    'TIMELESS ARTISAN PIECES · قطع تدوم',
  ];

  return (
    <div className="page-transition" style={{ backgroundColor: '#F7F1E8', color: '#292525' }}>
      <SEO
        title="Our Story · حكايتنا | HABA — حَبّة"
        description="Discover the story of HABA. Handcrafted beaded bags and artisan accessories made bead by bead with patience and passion."
        keywords="about HABA, our story, handmade beaded bags, artisan craft, حبة, قصة حبة"
      />

      {/* ── Section 1: Hero Header ── */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b" style={{ borderColor: '#E8C7B8' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          {/* Tag / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border"
            style={{ backgroundColor: '#fff', borderColor: '#E8C7B8' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#542A3A' }}></span>
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#C5A56A' }}>
              OUR STORY · حكايتنا
            </span>
          </div>

          {/* Bilingual Hero Headlines with Balanced Visual Proportions */}
          <h1 className="font-heading tracking-tight mb-4" style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', color: '#292525', lineHeight: 1.15 }}>
            Every Bead Tells a Story.
          </h1>
          <h2 className="font-heading font-medium mb-8" style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', color: '#542A3A', lineHeight: 1.3 }}>
            حَبّة ورا حَبّة، حكاية بتتعمل.
          </h2>

          <p className="font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#635751' }}>
            In a fast-paced world of mass production, <strong style={{ color: '#542A3A' }}>HABA (حَبّة)</strong> was born as a celebration of slow, mindful art. 
            We craft beaded bags and accessories that bring timeless luxury and warmth to your everyday moments.
          </p>
        </div>
      </section>

      {/* ── Section 2: Narrative Split (Artisan Story) ── */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Visual Image with soft luxury aesthetic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-sm overflow-hidden shadow-xl" style={{ aspectRatio: '4/5', backgroundColor: '#E8C7B8' }}>
                <img
                  src="/images/hero-lifestyle.webp"
                  alt="HABA Artisan Handmade Craft"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(41,37,37,0.45) 0%, transparent 60%)',
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="font-body text-xs tracking-widest uppercase font-semibold text-white/80 block mb-1">
                    GENUINE BEADWORK
                  </span>
                  <p className="font-heading italic text-xl text-white">
                    «كل حَبّة اتلضمت عشانك»
                  </p>
                </div>
              </div>

              {/* Decorative Floating Card */}
              <div
                className="hidden sm:block absolute -bottom-6 -right-6 p-5 rounded-sm border shadow-lg"
                style={{ backgroundColor: '#542A3A', borderColor: '#3d1e2a', color: '#F7F1E8', maxWidth: '240px' }}
              >
                <FiAward className="w-5 h-5 mb-2" style={{ color: '#C5A56A' }} />
                <p className="font-heading text-lg leading-snug">
                  100% Handcrafted
                </p>
                <p className="font-body text-xs mt-1" style={{ color: '#E8C7B8' }}>
                  بدون ماكينات، بصبر ولمسة يد فنانة.
                </p>
              </div>
            </div>

            {/* Right Column: The Philosophy */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              
              {/* Arabic Narrative */}
              <div className="text-right border-r-2 pr-6" style={{ borderColor: '#C5A56A' }} dir="rtl">
                <span className="font-body text-xs font-semibold tracking-wider uppercase block mb-2" style={{ color: '#C5A56A' }}>
                  البداية والفكرة
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl mb-4 font-semibold" style={{ color: '#542A3A' }}>
                  ليه سميناها «حَبّة»؟
                </h3>
                <p className="font-body text-base sm:text-lg leading-relaxed" style={{ color: '#4a3f3b' }}>
                  لأن كل حاجة عظيمة بتبدأ من تفصيلة صغيرة. «حَبّة» مش مجرد خرز، هي حَبّة صبر، وحَبّة حب، وحَبّة شغف. 
                  كل شنطة بنصنعها بتاخد ساعات طويلة من التركيز ولمس الخرز باليد حبة حبة، عشان تخرج قطعة فنية تشبهك، وتحكي قصتك في كل خروجة ومناسبة.
                </p>
              </div>

              {/* English Narrative */}
              <div className="text-left border-l-2 pl-6" style={{ borderColor: '#C98B91' }}>
                <span className="font-body text-xs font-semibold tracking-wider uppercase block mb-2" style={{ color: '#C98B91' }}>
                  THE PHILOSOPHY
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl mb-4 font-semibold" style={{ color: '#292525' }}>
                  The Patience Behind the Craft
                </h3>
                <p className="font-body text-base sm:text-lg leading-relaxed" style={{ color: '#4a3f3b' }}>
                  We believe true luxury is intimate and soulful. A factory machine can punch out thousands of identical bags in minutes, 
                  but none of them carry human dedication. At HABA, each piece is individually crafted with high-grade beads, durable threads, and meticulous balance.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Marquee Editorial Ribbon ── */}
      <div className="py-4 border-y overflow-hidden" style={{ backgroundColor: '#292525', borderColor: '#3d3939' }}>
        <Marquee
          speed={46}
          items={marqueeWords}
          itemClassName="text-sm font-heading font-normal tracking-wider px-4"
          itemStyle={{ color: '#F7F1E8' }}
          separator={<span className="mx-4 text-xs" style={{ color: '#C5A56A' }}>✦</span>}
        />
      </div>

      {/* ── Section 3: Three Pillars / ركائز البراند ── */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: '#fff' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase block mb-2" style={{ color: '#C5A56A' }}>
              OUR VALUES · قيمنا
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-semibold mb-4" style={{ color: '#292525' }}>
              Built On Detail & Devotion
            </h2>
            <p className="font-heading text-2xl" style={{ color: '#542A3A' }}>
              مباديء بنصنع بيها كل قطعة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brandHighlights.map((pillar, idx) => (
              <div
                key={idx}
                className="p-8 rounded-sm border transition-transform duration-300 hover:-translate-y-1 flex flex-col justify-between"
                style={{ backgroundColor: '#F7F1E8', borderColor: '#E8C7B8' }}
              >
                <div>
                  <div className="mb-6 p-3 rounded-sm inline-block" style={{ backgroundColor: '#fff', border: '1px solid #E8C7B8' }}>
                    {pillar.icon}
                  </div>

                  {/* English block */}
                  <h3 className="font-heading text-2xl font-semibold mb-2" style={{ color: '#292525' }}>
                    {pillar.enTitle}
                  </h3>
                  <p className="font-body text-sm leading-relaxed mb-6" style={{ color: '#635751' }}>
                    {pillar.enDesc}
                  </p>
                </div>

                {/* Arabic block */}
                <div className="pt-5 border-t text-right" style={{ borderColor: '#E8C7B8' }} dir="rtl">
                  <h4 className="font-heading text-xl font-semibold mb-1" style={{ color: '#542A3A' }}>
                    {pillar.arTitle}
                  </h4>
                  <p className="font-body text-sm leading-relaxed" style={{ color: '#635751' }}>
                    {pillar.arDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Section 4: Signature Quote Banner ── */}
      <section className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: '#542A3A', color: '#F7F1E8' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <span className="text-3xl text-[#C5A56A] block mb-4">❝</span>
          <h3 className="font-heading italic font-light tracking-wide mb-4" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.3 }}>
            حَبّة ورا حَبّة، حكاية بتتعمل.
          </h3>
          <p className="font-body text-sm sm:text-base tracking-[0.15em] uppercase font-medium text-[#E8C7B8] mb-8">
            Made bead by bead — with patience, detail and love.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase transition-all duration-300 shadow-md"
              style={{
                backgroundColor: '#F7F1E8',
                color: '#542A3A',
                borderRadius: '3px',
              }}
            >
              <span>Explore Collection · تسوقي القطع</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-body font-semibold tracking-wider uppercase border transition-colors duration-300"
              style={{
                borderColor: '#E8C7B8',
                color: '#F7F1E8',
                borderRadius: '3px',
              }}
            >
              Custom Inquiries · طلب تصميم خاص
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
