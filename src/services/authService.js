const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

function buildAuthPayload(user) {
  return {
    token: signToken({ id: String(user._id), role: user.role }),
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const user = await User.create({ name, email, password });
  return buildAuthPayload(user);
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordIsValid = await user.comparePassword(password);
  if (!passwordIsValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return buildAuthPayload(user);
}

module.exports = {
  registerUser,
  loginUser,
};
