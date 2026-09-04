const mongoose = require('mongoose');

const aiJobSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: {
        values: ['IMAGE_PROCESSING', 'CONTENT_GENERATION'],
        message: 'Type must be IMAGE_PROCESSING or CONTENT_GENERATION',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
        message: 'Status must be PENDING, PROCESSING, COMPLETED, or FAILED',
      },
      default: 'PENDING',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Job input data is required'],
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    retryCount: {
      type: Number,
      default: 0,
      min: [0, 'Retry count cannot be negative'],
    },
    maxRetries: {
      type: Number,
      default: 3,
      min: [1, 'Max retries must be at least 1'],
    },
    completedAt: {
      type: Date,
      default: null,
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
aiJobSchema.index({ product: 1, type: 1 });
aiJobSchema.index({ status: 1 });

const AIJob = mongoose.model('AIJob', aiJobSchema);

module.exports = AIJob;
