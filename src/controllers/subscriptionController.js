const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../middlewares/responseFormatter');
const {
  purchaseSubscription,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  getUserHistory,
  getAllSubscriptions,
  getCurrentActiveSubscription,
} = require('../services/subscriptionService');

const purchase = asyncHandler(async (req, res) => {
  const subscription = await purchaseSubscription({
    userId: req.user._id,
    planId: req.body.planId,
    autoRenew: req.body.autoRenew,
  });

  return res.status(201).json(successResponse('Subscription created successfully', subscription));
});

const upgrade = asyncHandler(async (req, res) => {
  const subscription = await upgradeSubscription({
    userId: req.user._id,
    planId: req.body.planId,
    autoRenew: req.body.autoRenew,
  });

  return res.status(201).json(successResponse('Subscription upgraded successfully', subscription));
});

const downgrade = asyncHandler(async (req, res) => {
  const subscription = await downgradeSubscription({
    userId: req.user._id,
    planId: req.body.planId,
    autoRenew: req.body.autoRenew,
  });

  return res.status(201).json(successResponse('Subscription downgraded successfully', subscription));
});

const cancel = asyncHandler(async (req, res) => {
  const subscription = await cancelSubscription({ userId: req.user._id });
  return res.status(200).json(successResponse('Subscription cancelled successfully', subscription));
});

const history = asyncHandler(async (req, res) => {
  const subscriptions = await getUserHistory(req.user._id);
  return res.status(200).json(successResponse('Subscription history fetched successfully', subscriptions));
});

const current = asyncHandler(async (req, res) => {
  const subscription = await getCurrentActiveSubscription(req.user._id);
  return res.status(200).json(successResponse('Current subscription fetched successfully', subscription));
});

const adminList = asyncHandler(async (req, res) => {
  const subscriptions = await getAllSubscriptions();
  return res.status(200).json(successResponse('All subscriptions fetched successfully', subscriptions));
});

module.exports = {
  purchase,
  upgrade,
  downgrade,
  cancel,
  history,
  current,
  adminList,
};
