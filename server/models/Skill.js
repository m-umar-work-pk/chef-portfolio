const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String, default: '' },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  level: { type: Number, default: 80, min: 0, max: 100 },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
