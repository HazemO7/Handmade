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

    // If no real API key is provided, simulate processing
    if (!env.AI_API_KEY || env.AI_API_KEY === 'mock_api_key' || env.NODE_ENV === 'test') {
      console.log(`[AI Mock] Generating content for product: ${productBasicInfo.name}`);
      
      // Simulate network/processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        shortDescription: `Beautiful handmade ${productBasicInfo.name}.`,
        description: `This is a meticulously crafted ${productBasicInfo.name}. It embodies our warm, minimal, elegant aesthetic.`,
        highlights: ['Handmade with love', 'Premium quality', 'Unique design'],
        features: productBasicInfo.features?.length ? productBasicInfo.features : ['Durable material', 'Ethically sourced'],
        tags: [productBasicInfo.name.toLowerCase().replace(/\s+/g, '-'), 'handmade', 'artisan'],
        seo: {
          title: `Buy ${productBasicInfo.name} | ${brandSettings.brandName || 'Handmade Store'}`,
          description: `Shop the handmade ${productBasicInfo.name}. Premium quality and artisan design.`
        }
      };
    }

    // --- REAL IMPLEMENTATION EXAMPLE (Using OpenAI SDK) ---
    /*
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: env.AI_API_KEY });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are an expert e-commerce copywriter specializing in artisan handmade goods. Output valid JSON only." },
        { role: "user", content: prompt }
      ]
    });
    
    return JSON.parse(response.choices[0].message.content);
    */

    throw new AppError('Real AI processing requires a valid provider SDK setup', 501);

  } catch (error) {
    console.error('AI Content Generation Failed:', error);
    throw new AppError(error.message || 'AI Content generation failed', 500);
  }
};

module.exports = {
  generateContent,
};
