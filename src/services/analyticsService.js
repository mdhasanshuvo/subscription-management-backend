const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const { expireDueSubscriptions } = require('./subscriptionService');

async function getAdminAnalytics() {
  await expireDueSubscriptions({});

  const [totalUsers, totalActiveSubscriptions, revenueAggregation, subscriptionsByPlan, expiredSubscriptions] = await Promise.all([
    User.countDocuments(),
    Subscription.countDocuments({ status: 'Active' }),
    Subscription.aggregate([
      {
        $match: {
          paymentStatus: { $in: ['Success', 'Renewed'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$priceAtPurchase' },
        },
      },
    ]),
    Subscription.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'plans',
          localField: '_id',
          foreignField: '_id',
          as: 'plan',
        },
      },
      {
        $unwind: '$plan',
      },
      {
        $project: {
          _id: 0,
          planId: '$plan._id',
          planName: '$plan.planName',
          count: 1,
        },
      },
      {
        $sort: { planName: 1 },
      },
    ]),
    Subscription.countDocuments({ status: 'Expired' }),
  ]);

  return {
    totalUsers,
    totalActiveSubscriptions,
    totalRevenue: revenueAggregation[0]?.totalRevenue || 0,
    subscriptionsByPlan,
    expiredSubscriptions,
  };
}

module.exports = {
  getAdminAnalytics,
};
