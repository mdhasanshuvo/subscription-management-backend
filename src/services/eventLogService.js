const EventLog = require('../models/EventLog');

async function logEvent(payload) {
  return EventLog.create(payload);
}

module.exports = {
  logEvent,
};
