const env = require('../../config/env');
const AppError = require('../../common/errors/AppError');

/**
 * Generate product content via AI
 * Uses a mock/simulated delay for development/testing if AI_API_KEY is missing.
 * 
 * @param {Object} productBasicInfo - Basic details (name, price, category name, materials, etc.)
 * @param {Object} brandSettings - BrandSettings document containing aiInstructions
 * @returns {Promise<Object>} generatedContent - structured JSON matching product schema
 */
const generateContent = async (productBasicInfo, brandSettings) => {
  try {
    const prompt = `
      ${brandSettings.aiInstructions}
      
      Generate a comprehensive product listing for the following item:
      Name: ${productBasicInfo.name}
      Price: ${productBasicInfo.price} ${brandSettings.defaultCurrency || 'USD'}
      Features/Materials provided: ${JSON.stringify(productBasicInfo.features || [])}
      
      Output MUST be valid JSON matching this structure exactly (do NOT include markdown backticks around the JSON):
      {
        "shortDescription": "1-2 engaging sentences.",
        "description": "Full HTML-formatted or well-structured text description.",
        "highlights": ["highlight 1", "highlight 2", "highlight 3"],
        "features": ["feature 1", "feature 2"],
        "tags": ["tag1", "tag2"],
        "seo": {
          "title": "SEO optimized title (max 60 chars)",
          "description": "SEO optimized description (max 160 chars)"
        }
      }
    `.trim();

    // If no real API key is provided or mock mode
    if (!env.AI_API_KEY || env.AI_API_KEY === 'mock_api_key' || env.NODE_ENV === 'test') {
      console.log(`[AI Mock] Generating content for product: ${productBasicInfo.name}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return getFallbackContent(productBasicInfo, brandSettings);
    }

    // Check if it's an OpenAI key (sk-...)
    if (env.AI_API_KEY.startsWith('sk-')) {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: env.AI_API_KEY });
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are an expert e-commerce copywriter specializing in artisan handmade goods. Output valid JSON only.' },
            { role: 'user', content: prompt }
          ]
        });
        return JSON.parse(response.choices[0].message.content);
      } catch (err) {
        console.warn('OpenAI call failed, falling back to template:', err.message);
        return getFallbackContent(productBasicInfo, brandSettings);
      }
    }

    // Otherwise, treat as Google Gemini API key
    try {
      console.log(`[Gemini AI] Generating content for ${productBasicInfo.name}...`);
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.AI_API_KEY}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Gemini AI] Request failed (${response.status}): ${errorText}`);
        return getFallbackContent(productBasicInfo, brandSettings);
      }

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return JSON.parse(rawText);
      }
    } catch (geminiErr) {
      console.warn('[Gemini AI] Generation error:', geminiErr.message);
      return getFallbackContent(productBasicInfo, brandSettings);
    }

    return getFallbackContent(productBasicInfo, brandSettings);
  } catch (error) {
    console.error('AI Content Generation Failed:', error);
    return getFallbackContent(productBasicInfo, brandSettings);
  }
};

const getFallbackContent = (productBasicInfo, brandSettings = {}) => ({
  shortDescription: `Beautiful handmade ${productBasicInfo.name}.`,
  description: `This is a meticulously crafted ${productBasicInfo.name}. It embodies our warm, minimal, elegant aesthetic.`,
  highlights: ['Handmade with love', 'Premium quality', 'Unique design'],
  features: productBasicInfo.features?.length ? productBasicInfo.features : ['Durable material', 'Ethically sourced'],
  tags: [productBasicInfo.name.toLowerCase().replace(/\s+/g, '-'), 'handmade', 'artisan'],
  seo: {
    title: `Buy ${productBasicInfo.name} | ${brandSettings.brandName || 'HABA | حَبّة'}`,
    description: `Shop the handmade ${productBasicInfo.name}. Premium quality and artisan design.`
  }
});

module.exports = {
  generateContent,
};
