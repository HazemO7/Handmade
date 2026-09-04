const multer = require('multer');
const AppError = require('../errors/AppError');

// Store file in memory to upload to Cloudinary stream later
const storage = multer.memoryStorage();

// Filter for accepting only specific image types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only jpeg, png, or webp images.', 400), false);
  }
};

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const uploadSingle = upload.single('image');
const uploadMultiple = upload.array('images', 5);

module.exports = {
  uploadSingle,
  uploadMultiple,
};
