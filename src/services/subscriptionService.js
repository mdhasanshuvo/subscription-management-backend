const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const ApiError = require('../utils/ApiError');
const { addDays, isExpired } = require('../utils/dates');
const { logEvent } = require('./eventLogService');

async function expireDueSubscriptions(filter = {}) {
  await Subscription.updateMany(
    {
      ...filter,
      status: 'Active',
      expiryDate: { $lte: new Date() },
    },
    {
      $set: { status: 'Expired' },
    }
  );
}

async function getCurrentActiveSubscription(userId) {
  await expireDueSubscriptions({ user: userId });

  return Subscription.findOne({ user: userId, status: 'Active' })
    .sort({ createdAt: -1 })
    .populate('plan');
}

async function purchaseSubscription({ userId, planId, autoRenew = false }) {
  const plan = await Plan.findById(planId);
  if (!plan || !plan.activeStatus) {
    throw new ApiError(404, 'Plan not found or inactive');
  }

  await expireDueSubscriptions({ user: userId });

  const activeSubscription = await Subscription.findOne({ user: userId, status: 'Active' });
  if (activeSubscription && String(activeSubscription.plan) === String(plan._id)) {
    throw new ApiError(400, 'You already have an active subscription for this plan.');
  }

  if (activeSubscription) {
    throw new ApiError(400, 'You already have an active subscription. Use upgrade or downgrade instead.');
  }

  const subscription = await Subscription.create({
    user: userId,
    plan: plan._id,
    priceAtPurchase: plan.price,
    startDate: new Date(),
    expiryDate: addDays(new Date(), plan.durationInDays),
    status: 'Active',
    paymentStatus: 'Success',
    autoRenew,
    changedByAction: 'Purchase',
  });

  await logEvent({
    eventType: 'Purchase',
    actorUser: userId,
    subscription: subscription._id,
    plan: plan._id,
    metadata: { priceAtPurchase: plan.price, autoRenew },
  });

  return subscription.populate('plan');
}

async function upgradeSubscription({ userId, planId, autoRenew = false }) {
  const currentSubscription = await getCurrentActiveSubscription(userId);
  if (!currentSubscription) {
    throw new ApiError(400, 'No active subscription found to upgrade');
  }

  const targetPlan = await Plan.findById(planId);
  if (!targetPlan || !targetPlan.activeStatus) {
    throw new ApiError(404, 'Plan not found or inactive');
  }

  if (targetPlan.price <= currentSubscription.plan.price) {
    throw new ApiError(400, 'Upgrade requires a higher priced plan. Use downgrade instead.');
  }

  currentSubscription.status = 'Upgraded';
  await currentSubscription.save();

  const newSubscription = await Subscription.create({
    user: userId,
    plan: targetPlan._id,
    priceAtPurchase: targetPlan.price,
    startDate: new Date(),
    expiryDate: addDays(new Date(), targetPlan.durationInDays),
    status: 'Active',
    paymentStatus: 'Success',
    autoRenew,
    parentSubscription: currentSubscription._id,
    changedByAction: 'Upgrade',
  });

  await logEvent({
    eventType: 'Upgrade',
    actorUser: userId,
    subscription: newSubscription._id,
    plan: targetPlan._id,
    metadata: { fromSubscription: currentSubscription._id, previousPlanPrice: currentSubscription.plan.price },
  });

  return newSubscription.populate('plan parentSubscription');
}

async function downgradeSubscription({ userId, planId, autoRenew = false }) {
  const currentSubscription = await getCurrentActiveSubscription(userId);
  if (!currentSubscription) {
    throw new ApiError(400, 'No active subscription found to downgrade');
  }

  const targetPlan = await Plan.findById(planId);
  if (!targetPlan || !targetPlan.activeStatus) {
    throw new ApiError(404, 'Plan not found or inactive');
  }

  if (targetPlan.price >= currentSubscription.plan.price) {
    throw new ApiError(400, 'Downgrade requires a lower priced plan. Use upgrade instead.');
  }

  // Simple approach: apply the downgrade immediately so the user moves to the lower tier in one step.
  currentSubscription.status = 'Downgraded';
  await currentSubscription.save();

  const newSubscription = await Subscription.create({
    user: userId,
    plan: targetPlan._id,
    priceAtPurchase: targetPlan.price,
    startDate: new Date(),
    expiryDate: addDays(new Date(), targetPlan.durationInDays),
    status: 'Active',
    paymentStatus: 'Success',
    autoRenew,
    parentSubscription: currentSubscription._id,
    changedByAction: 'Downgrade',
  });

  await logEvent({
    eventType: 'Downgrade',
    actorUser: userId,
    subscription: newSubscription._id,
    plan: targetPlan._id,
    metadata: { fromSubscription: currentSubscription._id, previousPlanPrice: currentSubscription.plan.price },
  });

  return newSubscription.populate('plan parentSubscription');
}

async function cancelSubscription({ userId }) {
  const currentSubscription = await getCurrentActiveSubscription(userId);
  if (!currentSubscription) {
    throw new ApiError(400, 'No active subscription found to cancel');
  }

  currentSubscription.status = 'Cancelled';
  await currentSubscription.save();

  await logEvent({
    eventType: 'Cancel',
    actorUser: userId,
    subscription: currentSubscription._id,
    plan: currentSubscription.plan._id,
    metadata: { cancelledAt: new Date() },
  });

  return currentSubscription.populate('plan');
}

async function getUserHistory(userId) {
  await expireDueSubscriptions({ user: userId });

  return Subscription.find({ user: userId }).sort({ createdAt: -1 }).populate('plan parentSubscription');
}

async function getAllSubscriptions() {
  await expireDueSubscriptions({});

  return Subscription.find().sort({ createdAt: -1 }).populate('user plan parentSubscription');
}

async function processWebhookPaymentUpdate({ subscriptionId, eventType, metadata = {} }) {
  const subscription = await Subscription.findById(subscriptionId).populate('plan');
  if (!subscription) {
    throw new ApiError(404, 'Subscription not found');
  }

  if (eventType === 'payment_success') {
    subscription.paymentStatus = 'Success';
    subscription.status = 'Active';
  } else if (eventType === 'payment_failed') {
    subscription.paymentStatus = 'Failed';
    subscription.status = 'PaymentFailed';
  } else if (eventType === 'renewal_success') {
    const baseDate = isExpired(subscription.expiryDate) ? new Date() : subscription.expiryDate;
    subscription.paymentStatus = 'Renewed';
    subscription.status = 'Active';
    subscription.startDate = new Date();
    subscription.expiryDate = addDays(baseDate, subscription.plan.durationInDays);
  } else {
    throw new ApiError(400, 'Unsupported webhook event type');
  }

  subscription.changedByAction = 'Webhook';
  await subscription.save();

  await logEvent({
    eventType: 'Webhook',
    subscription: subscription._id,
    plan: subscription.plan._id,
    metadata: { eventType, ...metadata },
  });

  return subscription.populate('plan');
}

module.exports = {
  expireDueSubscriptions,
  getCurrentActiveSubscription,
  purchaseSubscription,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  getUserHistory,
  getAllSubscriptions,
  processWebhookPaymentUpdate,
};
