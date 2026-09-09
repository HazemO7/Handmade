const env = require('../../config/env');
const Product = require('../products/product.model');
const Settings = require('../settings/settings.model');

/**
 * Clean & format phone number for international WhatsApp link
 */
const formatWhatsAppUrl = (phone, text) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(text || 'مرحباً، أود الاستفسار عن طلب خاص من حَبّة (HABA)');
  return `https://wa.me/${digits}?text=${encoded}`;
};

/**
 * Intelligent Fallback Engine (Runs when AI_API_KEY is missing or reaches quota limit)
 */
const getFallbackReply = (message, products, whatsappUrl) => {
  const lower = (message || '').toLowerCase();

  // 1. Custom order inquiry
  if (
    lower.includes('تفصيل') ||
    lower.includes('طلب خاص') ||
    lower.includes('مخصوص') ||
    lower.includes('custom') ||
    lower.includes('تصميم خاص') ||
    lower.includes('شكل معين') ||
    lower.includes('لون معين')
  ) {
    return {
      reply: 'أهلاً بكِ في حَبّة! نعم، نقوم بتنفيذ قطع وتصميمات خاصة حسب طلبكِ بالكامل (اختيار ألوان الخرز، المقاس، ونوع القفل أو السلسلة). يستغرق التنفيذ اليدوي خرزة بخرزة من 5 إلى 7 أيام عمل. يمكنكِ الضغط على زر الواتساب بالأسفل لمشاركتنا صورة التصميم وسنتواصل معكِ فوراً للتفاصيل!',
      isCustomOrder: true,
      suggestedProducts: [],
    };
  }

  // 2. Shipping & Delivery
  if (
    lower.includes('شحن') ||
    lower.includes('توصيل') ||
    lower.includes('كام يوم') ||
    lower.includes('مدة') ||
    lower.includes('shipping') ||
    lower.includes('delivery') ||
    lower.includes('المحافظات')
  ) {
    return {
      reply: 'نوصل طلبات حَبّة لجميع محافظات مصر! 🚚\n• القاهرة والجيزة: التوصيل خلال 2 إلى 3 أيام عمل.\n• باقي المحافظات: التوصيل خلال 3 إلى 5 أيام عمل.\n• القطع التفصيل الخاص: تأخذ 5-7 أيام للتجهيز اليدوي المتقن قبل الشحن.\nجميع القطع تُغلف بعناية فائقة كهدية جاهزة.',
      isCustomOrder: false,
      suggestedProducts: [],
    };
  }

  // 3. Materials & Craftsmanship
  if (
    lower.includes('خرز') ||
    lower.includes('خامات') ||
    lower.includes('خامه') ||
    lower.includes('جودة') ||
    lower.includes('material') ||
    lower.includes('bead') ||
    lower.includes('تنظيف') ||
    lower.includes('عناية')
  ) {
    return {
      reply: 'كل قطعة في «حَبّة» تُصنع يدوياً 100% بدون أي ماكينات، باستخدام خيوط فائقة المتانة وخيوط صيد مقواة مقاومة للقطع، مع خرز كريستال وأكريليك ولؤلؤ صناعي عالي اللمعان والنقاء. يُفضل حفظ الشنطة داخل كيس القماش المرفق ومسحها بقطعة قطن جافة بلطف للحفاظ على بريقها دائماً.',
      isCustomOrder: false,
      suggestedProducts: [],
    };
  }

  // 4. Products & Pricing Inquiry
  if (
    lower.includes('سعر') ||
    lower.includes('أسعار') ||
    lower.includes('شنط') ||
    lower.includes('شنطة') ||
    lower.includes('منتجات') ||
    lower.includes('price') ||
    lower.includes('bag') ||
    lower.includes('كام')
  ) {
    const activeProducts = products.slice(0, 3);
    const productNames = activeProducts.map(p => `• ${p.name} (${p.price})`).join('\n');
    return {
      reply: `تفضلي، هذه بعض من أحدث تشكيلاتنا اليدوية المتاحة حالياً:\n${productNames || 'جميع القطع مشغولة بحب وإتقان.'}\n\nيمكنكِ استعراض التفاصيل الكاملة بالضغط على كروت المنتجات أدناه أو تصفح قسم "تسوقي القطع" في المتجر!`,
      isCustomOrder: false,
      suggestedProducts: activeProducts,
    };
  }

  // General default welcome reply
  const randomSuggestions = products.slice(0, 2);
  return {
    reply: 'أهلاً بكِ في «حَبّة | HABA» ✨ يسعدني مساعدتكِ دائماً! يمكنكِ سؤالي عن أسعار ومقاسات الشنط المتوفرة، خامات الخرز وطريقة العناية بالقطع، مواعيد الشحن والتوصيل، أو كيفية طلب تصميم خاص بكِ تماماً.',
    isCustomOrder: false,
    suggestedProducts: randomSuggestions,
  };
};

/**
 * Handle incoming chat message from user
 * @param {Object} params - { message, history }
 */
const handleChatMessage = async ({ message, history = [] }) => {
  // 1. Fetch store settings and active products
  const [settings, publishedProducts] = await Promise.all([
    Settings.findOne().lean(),
    Product.find({ status: 'PUBLISHED' })
      .select('name slug price currency shortDescription materials colors dimensions images stock')
      .limit(20)
      .lean(),
  ]);

  const whatsappPhone = settings?.whatsappNumber || env.WHATSAPP_NUMBER || '';
  const defaultCurrency = settings?.defaultCurrency || 'EGP';
  const whatsappUrl = formatWhatsAppUrl(whatsappPhone, `مرحباً، أود الاستفسار عن طلب من حَبّة (HABA): "${message}"`);

  // Format products catalog context
  const catalogSummary = (publishedProducts || []).map(p => {
    const primaryImg = p.images?.find(i => i.isPrimary) || p.images?.[0];
    return {
      name: p.name,
      slug: p.slug,
      price: `${p.price} ${p.currency || defaultCurrency}`,
      materials: p.materials?.join(', ') || 'خرز يدوي عالي الجودة',
      colors: p.colors?.join(', ') || '',
      dimensions: p.dimensions || '',
      shortDescription: p.shortDescription || '',
      image: primaryImg?.originalUrl || '',
    };
  });

  const catalogContextText = catalogSummary.length > 0
    ? catalogSummary.map(p => `- ${p.name} | السعر: ${p.price} | الرابط: /product/${p.slug} | الخامات: ${p.materials} | الأبعاد: ${p.dimensions || 'غير محدد'}`).join('\n')
    : 'حالياً جاري تحديث قائمة المنتجات المعروضة.';

  // 2. Check if AI_API_KEY is configured
  if (!env.AI_API_KEY || env.AI_API_KEY === 'mock_api_key' || env.NODE_ENV === 'test') {
    const fallback = getFallbackReply(message, catalogSummary, whatsappUrl);
    return {
      ...fallback,
      whatsappUrl,
    };
  }

  // 3. System Prompt for HABA Shopping Assistant
  const systemPrompt = `
أنت المساعد الذكي والمستشار الشخصي لمتجر «حَبّة | HABA» المتخصص في صناعة شنط وإكسسوارات الخرز اليدوية الفاخرة (Handmade Beaded Bags & Accessories).

### هوية وشخصية حَبّة:
- لهجتك وأسلوبك: دافئ، مهذب جداً، راقي، مصري ودود يرحب بالعملاء بذوق رفيع وأنوثة وأناقة تعكس هوية البراند.
- الشعار الأساسي: «حَبّة ورا حَبّة، حكاية بتتعمل» (كل قطعة مصنوعة يدوياً 100% بالصبر ولمسة يد فنانة بدون أي ماكينات).
- الخامات: نستخدم خرز عالي الجودة ونقي وخيوط صيد مقواة فائقة المتانة.

### معلومات الشحن والتوصيل:
- التوصيل داخل القاهرة والجيزة: 2 إلى 3 أيام عمل.
- باقي المحافظات: 3 إلى 5 أيام عمل.
- الطلبات الخاصة (التفصيل): تأخذ 5 إلى 7 أيام عمل للتنفيذ اليدوي المتقن.

### كتالوج المنتجات الحالي في المتجر:
${catalogContextText}

### تعليمات الإجابة:
1. أجب باختصار ولطافة ورقي باللغة العربية (أو بالإنجليزية إذا سأل العميل بالإنجليزية).
2. عند السؤال عن الأسعار أو المنتجات، اذكر الأسعار من الكتالوج أعلاه بوضوح.
3. إذا أراد العميل تعديل مقاس أو لون أو تصميم خاص (Custom Order)، رحب بالفكرة وشجعه وأخبره بإمكانية التواصل فوراً عبر واتساب لتحديد المواصفات.
4. إخراجك النهائي يجب أن يكون بتنسيق JSON صحيح فقط لا غير، وبدون علامات كود ماركداون، وفق الهيكل التالي:
{
  "reply": "نص إجابتك هنا بأسلوب حَبّة الدافئ والواضح",
  "suggestedProductSlugs": ["slug1", "slug2"],
  "isCustomOrder": false
}
(ضع في suggestedProductSlugs روابط slug للمنتجات المذكورة في ردك إن وجدت، واجعل isCustomOrder قيمتها true إذا كان الاستفسار عن تفصيل أو تصميم خاص).
`.trim();

  // 4. Try OpenAI
  if (env.AI_API_KEY.startsWith('sk-')) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: env.AI_API_KEY });

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map(h => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content || '',
        })),
        { role: 'user', content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const parsed = JSON.parse(completion.choices[0].message.content);
      const suggestedSlugs = Array.isArray(parsed.suggestedProductSlugs) ? parsed.suggestedProductSlugs : [];
      const suggestedProducts = catalogSummary.filter(p => suggestedSlugs.includes(p.slug));

      return {
        reply: parsed.reply || 'أهلاً بكِ في حَبّة! كيف يمكنني مساعدتكِ اليوم؟',
        suggestedProducts,
        isCustomOrder: Boolean(parsed.isCustomOrder),
        whatsappUrl,
      };
    } catch (err) {
      console.warn('[Chat AI OpenAI error, using fallback]:', err.message);
      const fallback = getFallbackReply(message, catalogSummary, whatsappUrl);
      return { ...fallback, whatsappUrl };
    }
  }

  // 5. Try Google Gemini
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.AI_API_KEY}`;
    
    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nالسؤال الحالي: ${message}` }],
      },
    ];

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Gemini Chat API error (${response.status})]:`, errorText);
      const fallback = getFallbackReply(message, catalogSummary, whatsappUrl);
      return { ...fallback, whatsappUrl };
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    const suggestedSlugs = Array.isArray(parsed.suggestedProductSlugs) ? parsed.suggestedProductSlugs : [];
    const suggestedProducts = catalogSummary.filter(p => suggestedSlugs.includes(p.slug));

    return {
      reply: parsed.reply || 'أهلاً بكِ في حَبّة! كيف يمكنني مساعدتكِ اليوم؟',
      suggestedProducts,
      isCustomOrder: Boolean(parsed.isCustomOrder),
      whatsappUrl,
    };
  } catch (err) {
    console.warn('[Chat AI Gemini error, using fallback]:', err.message);
    const fallback = getFallbackReply(message, catalogSummary, whatsappUrl);
    return { ...fallback, whatsappUrl };
  }
};

module.exports = {
  handleChatMessage,
  formatWhatsAppUrl,
};
