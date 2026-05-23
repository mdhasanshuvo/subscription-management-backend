const mongoose = require('mongoose');
const { mongoUri } = require('./env');

let cachedConnection = global.mongooseConnection;
let cachedPromise = global.mongooseConnectionPromise;

async function connectDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedPromise) {
    mongoose.set('strictQuery', true);
    cachedPromise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    global.mongooseConnectionPromise = cachedPromise;
  }

  cachedConnection = await cachedPromise;
  global.mongooseConnection = cachedConnection;

  return cachedConnection;
}

module.exports = connectDatabase;
