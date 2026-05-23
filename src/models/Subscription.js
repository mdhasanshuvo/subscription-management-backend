const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
      index: true,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Expired', 'Cancelled', 'Upgraded', 'Downgraded', 'PaymentFailed'],
      default: 'Pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Renewed'],
      default: 'Pending',
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    parentSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    changedByAction: {
      type: String,
      enum: ['Purchase', 'Upgrade', 'Downgrade', 'Renewal', 'Cancel', 'Webhook'],
      default: 'Purchase',
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ user: 1, plan: 1, status: 1 });
subscriptionSchema.index({ user: 1, status: 1, expiryDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
