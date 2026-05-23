function addDays(baseDate, days) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);
  return date;
}

function isExpired(expiryDate) {
  return new Date(expiryDate).getTime() <= Date.now();
}

module.exports = {
  addDays,
  isExpired,
};
