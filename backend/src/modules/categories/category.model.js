const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
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
categorySchema.index({ sortOrder: 1 });

// Slug auto-generation hook
categorySchema.pre('validate', async function () {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = slugify(this.name, {
      lower: true,
      strict: false,
      trim: true,
    });

    if (!baseSlug) {
      baseSlug = 'category';
    }

    let slugCandidate = baseSlug;
    let counter = 1;

    // Ensure uniqueness
    const CategoryModel = this.constructor;
    while (await CategoryModel.exists({ slug: slugCandidate, _id: { $ne: this._id } })) {
      slugCandidate = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slugCandidate;
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
