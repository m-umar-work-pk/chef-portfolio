const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Special'],
  },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  ingredients: [{ type: String }],
  recipe: { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Dish', dishSchema);
