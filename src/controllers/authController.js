const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../middlewares/responseFormatter');
const { registerUser, loginUser } = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return res.status(201).json(successResponse('User registered successfully', result));
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return res.status(200).json(successResponse('User logged in successfully', result));
});

const me = asyncHandler(async (req, res) => {
  return res.status(200).json(
    successResponse('Current user fetched successfully', {
      id: String(req.user._id),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    })
  );
});

module.exports = {
  register,
  login,
  me,
};
