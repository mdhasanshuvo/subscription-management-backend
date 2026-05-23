const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../middlewares/responseFormatter');
const { createPlan, updatePlan, deletePlan, getPlans } = require('../services/planService');

const create = asyncHandler(async (req, res) => {
  const plan = await createPlan(req.body);
  return res.status(201).json(successResponse('Plan created successfully', plan));
});

const update = asyncHandler(async (req, res) => {
  const plan = await updatePlan(req.params.id, req.body);
  return res.status(200).json(successResponse('Plan updated successfully', plan));
});

const remove = asyncHandler(async (req, res) => {
  const plan = await deletePlan(req.params.id);
  return res.status(200).json(successResponse('Plan deactivated successfully', plan));
});

const listActive = asyncHandler(async (req, res) => {
  const plans = await getPlans({ activeOnly: true });
  return res.status(200).json(successResponse('Plans fetched successfully', plans));
});

const listAll = asyncHandler(async (req, res) => {
  const plans = await getPlans({ activeOnly: false });
  return res.status(200).json(successResponse('Plans fetched successfully', plans));
});

module.exports = {
  create,
  update,
  remove,
  listActive,
  listAll,
};
