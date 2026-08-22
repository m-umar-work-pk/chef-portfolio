const mongoose = require('mongoose');
const { app, seedAll } = require('../server/app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    await seedAll();
    isConnected = true;
  }
  return app(req, res);
};
