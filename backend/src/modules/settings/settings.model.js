const mongoose = require('mongoose');

const defaultImageStyle = `HABA artisan product photography.
Place the handcrafted piece on a clean Ivory (#F7F1E8) or warm beige linen surface.
Soft natural sunlight from the side, with subtle realistic warm shadows.
Clean, editorial aesthetic, boutique feeling, warm and feminine.
IMPORTANT: The handcrafted product itself must remain 100% authentic and untouched. Preserve all beads, pearls, threads, stitches, colors, materials, and textures exactly as shown.`;

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
