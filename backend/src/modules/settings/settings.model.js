const mongoose = require('mongoose');

const defaultImageStyle = `Create a premium handmade product photography style.
Use a warm, minimal, elegant aesthetic.
Use natural lighting.
Use a soft neutral background.
Use subtle realistic shadows.
The actual product must remain unchanged.
Do not modify its shape, color, material, texture, or design.`;

const defaultAiInstructions = `Write warm, engaging, and professional product copy tailored for handmade and artisanal items.
Highlight craftsmanship, quality, and aesthetic appeal without inventing unsupported technical facts.`;

const brandSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      trim: true,
      default: 'Handmade Store',
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
      default: '#8B6F47',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code'],
    },
    secondaryColor: {
      type: String,
      default: '#D4A574',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code'],
    },
    backgroundColor: {
      type: String,
      default: '#FDF8F4',
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
