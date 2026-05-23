const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      unique: true,
      maxlength: [120, 'Plan name cannot exceed 120 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
      min: [0.01, 'Price must be greater than zero'],
    },
    durationInDays: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 day'],
    },
    features: {
      type: [String],
      default: [],
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

planSchema.index({ planName: 1 }, { unique: true });
planSchema.index({ activeStatus: 1, price: 1 });

module.exports = mongoose.model('Plan', planSchema);
