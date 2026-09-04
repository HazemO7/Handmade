const mongoose = require('mongoose');
const slugify = require('../../common/utils/slugify');

const imageSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original image URL is required'],
    },
    processedUrl: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    alt: {
      type: String,
      default: '',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'EGP',
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    materials: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    dimensions: {
      type: String,
      trim: true,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PROCESSING', 'READY_FOR_REVIEW', 'PUBLISHED', 'ARCHIVED'],
        message: 'Status must be DRAFT, PROCESSING, READY_FOR_REVIEW, PUBLISHED, or ARCHIVED',
      },
      default: 'DRAFT',
    },
    seo: {
      title: {
        type: String,
        trim: true,
        default: '',
      },
      description: {
        type: String,
        trim: true,
        default: '',
      },
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

// Indexes
productSchema.index({ status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', tags: 'text', description: 'text' });

// Slug auto-generation
productSchema.pre('validate', async function () {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = slugify(this.name);

    if (!baseSlug) {
      baseSlug = 'product';
    }

    let slugCandidate = baseSlug;
    let counter = 1;

    const ProductModel = this.constructor;
    while (await ProductModel.exists({ slug: slugCandidate, _id: { $ne: this._id } })) {
      slugCandidate = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slugCandidate;
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
