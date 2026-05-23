function successResponse(message, data = null) {
  return {
    success: true,
    message,
    data,
  };
}

function errorResponse(message, details = null, statusCode = 500) {
  return {
    success: false,
    message,
    statusCode,
    details,
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
