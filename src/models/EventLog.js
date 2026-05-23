const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['Purchase', 'Upgrade', 'Downgrade', 'Cancel', 'Webhook', 'Renewal', 'PaymentFailed'],
      required: true,
      index: true,
    },
    actorUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EventLog', eventLogSchema);
