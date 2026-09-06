const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables before importing models
dotenv.config({ path: path.join(__dirname, '../../.env') });
const env = require('../config/env');

const User = require('../modules/users/user.model');
const Category = require('../modules/categories/category.model');
const Product = require('../modules/products/product.model');
const Settings = require('../modules/settings/settings.model');

// Sample Categories
const categoriesData = [
  { name: 'Crochet', description: 'Handcrafted crochet items', sortOrder: 1 },
  { name: 'Jewelry', description: 'Artisanal jewelry pieces', sortOrder: 2 },
  { name: 'Home Decor', description: 'Beautiful decor for your home', sortOrder: 3 },
  { name: 'Bags', description: 'Handmade bags and purses', sortOrder: 4 },
  { name: 'Accessories', description: 'Unique handmade accessories', sortOrder: 5 },
  { name: 'Gifts', description: 'Perfect handmade gifts for any occasion', sortOrder: 6 }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Allow passing MongoDB URI as a CLI argument: node seed.js "mongodb+srv://..."
    const dbUri = process.argv[2] || env.MONGODB_URI;
    console.log(`Connecting to MongoDB at ${dbUri.substring(0, 30)}...`);
    await mongoose.connect(dbUri);
    console.log('Connected successfully!');

    // 1. Seed Admin User
    console.log('Seeding Admin User...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@handmade.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Password123!';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Store Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log('Admin user already exists, skipping.');
    }

    // 2. Seed Settings
    console.log('Seeding Brand Settings...');
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        whatsappNumber: '+201234567890',
        brandName: 'Handmade Elegance',
        brandDescription: 'Crafting unique artisanal pieces with love and care.',
        photographyStyle: {
          background: 'minimalist',
          lighting: 'natural',
          composition: 'centered'
        }
      });
      console.log('Brand settings created');
    } else {
      console.log('Brand settings already exist, skipping.');
    }

    // 3. Seed Categories
    console.log('Seeding Categories...');
    const createdCategories = {};
    for (const catData of categoriesData) {
      let category = await Category.findOne({ name: catData.name });
      if (!category) {
        category = await Category.create(catData);
        console.log(`Created category: ${catData.name}`);
      } else {
        console.log(`Category exists: ${catData.name}`);
      }
      createdCategories[catData.name] = category._id;
    }

    // 4. Seed Products
    console.log('Seeding Products...');
    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      const sampleProducts = [
        {
          name: 'Cozy Winter Scarf',
          price: 250,
          category: createdCategories['Crochet'],
          stock: 5,
          status: 'PUBLISHED',
          description: 'A beautifully handmade crochet scarf to keep you warm.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1606822210403-f11100257e84?w=500', isPrimary: true, publicId: 'dummy_scarf' }]
        },
        {
          name: 'Silver Moon Pendant',
          price: 450,
          category: createdCategories['Jewelry'],
          stock: 2,
          status: 'PUBLISHED',
          description: 'Sterling silver pendant shaped like a crescent moon.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?w=500', isPrimary: true, publicId: 'dummy_pendant' }]
        },
        {
          name: 'Boho Macrame Wall Hanging',
          price: 600,
          category: createdCategories['Home Decor'],
          stock: 3,
          status: 'PUBLISHED',
          description: 'Intricate macrame wall hanging for a bohemian touch.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1522756614193-41ee1e60f252?w=500', isPrimary: true, publicId: 'dummy_macrame' }]
        },
        {
          name: 'Leather Tote Bag',
          price: 1200,
          category: createdCategories['Bags'],
          stock: 1,
          status: 'PUBLISHED',
          description: 'Hand-stitched genuine leather tote bag, perfect for everyday use.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', isPrimary: true, publicId: 'dummy_bag' }]
        },
        {
          name: 'Beaded Bracelet Set',
          price: 150,
          category: createdCategories['Accessories'],
          stock: 10,
          status: 'PUBLISHED',
          description: 'Set of 3 colorful beaded bracelets.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', isPrimary: true, publicId: 'dummy_bracelet' }]
        },
        {
          name: 'Custom Gift Basket',
          price: 850,
          category: createdCategories['Gifts'],
          stock: 4,
          status: 'PUBLISHED',
          description: 'A curated selection of our best handmade items in a beautiful basket.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500', isPrimary: true, publicId: 'dummy_basket' }]
        },
        {
          name: 'Amigurumi Teddy Bear',
          price: 350,
          category: createdCategories['Crochet'],
          stock: 6,
          status: 'PUBLISHED',
          description: 'Cute handcrafted crochet teddy bear toy.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1558231908-012b186b4f73?w=500', isPrimary: true, publicId: 'dummy_bear' }]
        },
        {
          name: 'Crystal Drop Earrings',
          price: 320,
          category: createdCategories['Jewelry'],
          stock: 0, // Out of stock to test UI
          status: 'PUBLISHED',
          description: 'Elegant drop earrings featuring natural quartz crystals.',
          images: [{ originalUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', isPrimary: true, publicId: 'dummy_earrings' }]
        }
      ];

      for (const prodData of sampleProducts) {
        await Product.create(prodData);
        console.log(`Created product: ${prodData.name}`);
      }
    } else {
      console.log('Products already exist, skipping.');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
