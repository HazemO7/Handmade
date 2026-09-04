const Product = require('./product.model');
const Category = require('../categories/category.model');
const AppError = require('../../common/errors/AppError');

/**
 * Get paginated and filtered products
 * @param {Object} queryOptions 
 */
const getProducts = async (queryOptions) => {
  const {
    page = 1,
    limit = 12,
    status,
    category, // This can be a slug or ID. We'll handle ID.
    search,
    sort = '-createdAt',
  } = queryOptions;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (category) {
    // If a category slug is passed, we might need to resolve it first, 
    // but typically the frontend will pass the category _id or slug.
    // Let's assume frontend passes category ID for filtering, or handle slug:
    if (category.length === 24) {
      query.category = category;
    } else {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) query.category = catDoc._id;
    }
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  // Build sort object based on sort string (e.g. '-price' -> { price: -1 })
  const sortObj = {};
  if (sort) {
    const sortFields = sort.split(',');
    sortFields.forEach(field => {
      if (field.startsWith('-')) {
        sortObj[field.substring(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });
  }
  
  // If text searching, sort by text score optionally, but we'll stick to sortObj for simplicity

  const products = await Product.find(query)
    .populate('category', 'name slug _id')
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);
  const pages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

/**
 * Get product by slug
 */
const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, status: 'PUBLISHED' }).populate('category', 'name slug _id');
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Get product by ID (Admin)
 */
const getProductById = async (id) => {
  const product = await Product.findById(id).populate('category', 'name slug _id');
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

/**
 * Create a new product (DRAFT by default)
 */
const createProduct = async (data) => {
  // Ensure status is DRAFT initially
  data.status = 'DRAFT';
  const product = await Product.create(data);
  return product;
};

/**
 * Update product
 */
const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Assign updated fields
  Object.keys(data).forEach(key => {
    // Avoid overriding status via standard update if we want strict transitions, but admin can do it.
    product[key] = data[key];
  });

  await product.save(); // triggers pre-validate slug regeneration if name changed
  return product;
};

const { deleteImage } = require('../../config/cloudinary');

/**
 * Delete a product
 */
const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Delete images from Cloudinary before deleting document
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      try {
        await deleteImage(image.publicId);
      } catch (err) {
        console.error(`Failed to delete image ${image.publicId} from Cloudinary`, err);
      }
    }
  }
  
  await product.deleteOne();
};

/**
 * Publish product
 */
const publishProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);

  // Validate publishing requirements
  if (!product.name || !product.price || !product.category) {
    throw new AppError('Cannot publish product: missing required fields (name, price, category)', 400);
  }
  
  // Enforce at least one image
  if (!product.images || product.images.length === 0) {
    throw new AppError('Cannot publish product without at least one image', 400);
  }

  product.status = 'PUBLISHED';
  await product.save();
  return product;
};

/**
 * Unpublish product
 */
const unpublishProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);

  product.status = 'DRAFT';
  await product.save();
  return product;
};

/**
 * Archive product
 */
const archiveProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);

  product.status = 'ARCHIVED';
  await product.save();
  return product;
};

/**
 * Get product dashboard stats
 */
const getProductStats = async () => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const outOfStock = await Product.countDocuments({ stock: { $lte: 0 } });

  const formattedStats = {
    total: 0,
    PUBLISHED: 0,
    DRAFT: 0,
    ARCHIVED: 0,
    outOfStock,
  };

  stats.forEach(stat => {
    formattedStats[stat._id] = stat.count;
    formattedStats.total += stat.count;
  });

  return formattedStats;
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  archiveProduct,
  getProductStats,
};
