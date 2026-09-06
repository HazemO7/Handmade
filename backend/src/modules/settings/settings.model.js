const mongoose = require('mongoose');

const defaultImageStyle = `Use the uploaded image as the exact product reference.

Create a premium e-commerce product photography image of this exact product.

### PRODUCT PRESERVATION
- Keep the product itself 100% faithful to the uploaded reference.
- Do NOT redesign, reshape, recolor, simplify, or add/remove any part of the product.
- Preserve the exact: Shape, Colors, Materials, Beads, Patterns, Details, Proportions, Texture, and Handmade imperfections.
- The final product must clearly look like the same physical product photographed professionally, not a recreated or AI-designed version.

### BRAND VISUAL IDENTITY
The brand is a premium handmade accessories brand specializing in beaded necklaces, bags, pendants, bracelets, and other handmade beadwork.
Build a consistent visual identity around the product.
Use a warm, elegant, artistic, handmade aesthetic.
The background must follow a consistent brand color palette across ALL product images.

### COLOR SYSTEM
Use a cohesive palette based on:
- Warm off-white / ivory (#F7F1E8)
- Soft beige
- Light sand
- Subtle warm earthy tones
- Very soft muted accent colors
The background should feel premium, warm, feminine, artistic, and handmade.
Avoid: Pure white backgrounds, Strong saturated colors, Random colors, Heavy gradients, Visually distracting backgrounds.

### CONSISTENCY RULE
Every future product image generated using this prompt must feel like it belongs to the same brand photoshoot and the same visual identity.
Maintain the same: Background color family, Color temperature, Lighting style, Shadow softness, Photography style, Visual mood, Minimalism, Composition language, Level of contrast, Premium handmade aesthetic.
Even when the product itself has completely different colors, the environment and visual treatment must remain consistent.

### PHOTOGRAPHY STYLE
Create professional high-end product photography.
- Soft diffused studio lighting
- Natural soft shadows
- Subtle depth
- Clean composition
- Premium editorial aesthetic
- Realistic materials and textures
- High detail
- Sharp product focus
- Slightly warm color temperature
- Minimal styling
- Sophisticated handmade-luxury feeling
Use subtle natural props only when they enhance the composition, such as: Linen fabric, Ceramic objects, Natural wood, Small dried flowers, Neutral stones, Handmade paper. Props must remain secondary and never distract from the product.

### COMPOSITION
The product is the hero. Place the product naturally in the center or using a refined editorial composition. Leave enough negative space around the product.

### BRAND RECOGNITION
The brand should be recognizable through the consistent visual language, not by adding a logo to every image.
Do NOT add: Fake logos, Random text, Watermarks, Typography, Product labels.

### OUTPUT
Generate a photorealistic, premium product photograph.
DO NOT CHANGE THE PRODUCT. CHANGE ONLY THE PHOTOGRAPHY ENVIRONMENT AND VISUAL PRESENTATION.`;

const defaultAiInstructions = `Write warm, simple, emotional, and elegant product copy tailored for HABA | حَبّة handmade artisanal items.
Emphasize that every piece is made bead by bead with patience and dedication.
Highlight craftsmanship, quality, and unique aesthetic without sounding corporate or salesy.`;

const brandSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      trim: true,
      default: 'HABA | حَبّة',
    },
    logo: {
      type: String,
      default: '',
    },
    logoPublicId: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#542A3A',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code'],
    },
    secondaryColor: {
      type: String,
      default: '#C98B91',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code'],
    },
    backgroundColor: {
      type: String,
      default: '#F7F1E8',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code'],
    },
    fontPreference: {
      type: String,
      default: 'serif',
    },
    visualStyle: {
      type: String,
      default: 'warm, minimal, elegant',
    },
    imageStyle: {
      type: String,
      default: defaultImageStyle,
    },
    whatsappNumber: {
      type: String,
      trim: true,
      default: '',
    },
    defaultCurrency: {
      type: String,
      trim: true,
      default: 'EGP',
    },
    aiInstructions: {
      type: String,
      default: defaultAiInstructions,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Singleton helper: get or create settings
brandSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Singleton helper: update settings
brandSettingsSchema.statics.updateSettings = async function (data) {
  const settings = await this.findOneAndUpdate({}, { $set: data }, {
    returnDocument: 'after',
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });
  return settings;
};

const BrandSettings = mongoose.model('BrandSettings', brandSettingsSchema);

module.exports = BrandSettings;
