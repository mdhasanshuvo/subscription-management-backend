const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../middlewares/responseFormatter');
const { getAdminAnalytics } = require('../services/analyticsService');

const dashboard = asyncHandler(async (req, res) => {
  const analytics = await getAdminAnalytics();
  return res.status(200).json(successResponse('Analytics fetched successfully', analytics));
});

module.exports = {
  dashboard,
};
