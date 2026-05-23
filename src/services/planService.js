const Plan = require('../models/Plan');
const ApiError = require('../utils/ApiError');

async function createPlan(payload) {
  const existingPlan = await Plan.findOne({ planName: payload.planName });
  if (existingPlan) {
    throw new ApiError(409, 'Plan name must be unique');
  }

  return Plan.create(payload);
}

async function updatePlan(planId, payload) {
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new ApiError(404, 'Plan not found');
  }

  if (payload.planName && payload.planName !== plan.planName) {
    const duplicate = await Plan.findOne({ planName: payload.planName });
    if (duplicate) {
      throw new ApiError(409, 'Plan name must be unique');
    }
  }

  Object.assign(plan, payload);
  await plan.save();
  return plan;
}

async function deletePlan(planId) {
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new ApiError(404, 'Plan not found');
  }

  plan.activeStatus = false;
  await plan.save();
  return plan;
}

async function getPlans({ activeOnly = false } = {}) {
  return Plan.find(activeOnly ? { activeStatus: true } : {}).sort({ price: 1 });
}

module.exports = {
  createPlan,
  updatePlan,
  deletePlan,
  getPlans,
};
