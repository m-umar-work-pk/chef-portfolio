const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Muhammad Umair' },
  title: { type: String, default: 'Professional Chef' },
  bio: { type: String },
  experience: { type: Number, default: 10 },
  speciality: { type: String },
  image: { type: String, default: '' },
  socialLinks: {
    instagram: String,
    twitter: String,
    facebook: String,
    linkedin: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
