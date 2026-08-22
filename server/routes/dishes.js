const express = require('express');
const { cloudinary, createUpload } = require('../config/cloudinary');
const Dish = require('../models/Dish');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = createUpload('dishes', { width: 800, height: 600, crop: 'limit' });

// GET /api/dishes
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (featured) query.featured = featured === 'true';
    const dishes = await Dish.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: dishes.length, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dishes/:id
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: 'Dish not found' });
    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/dishes
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, featured, ingredients, available } = req.body;
    if (!name || !description || !category) {
      return res.status(400).json({ success: false, message: 'Name, description, and category are required' });
    }
    const dishData = {
      name,
      description,
      category,
      featured: featured === 'true' || featured === true,
      ingredients: ingredients ? (typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients) : [],
      available: available !== 'false',
    };
    if (req.file) {
      dishData.image = req.file.path;
      dishData.imagePublicId = req.file.filename;
    }
    const dish = await Dish.create(dishData);
    res.status(201).json({ success: true, data: dish });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/dishes/:id
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: 'Dish not found' });

    const updateData = { ...req.body };
    if (req.body.featured !== undefined) updateData.featured = req.body.featured === 'true' || req.body.featured === true;
    if (req.body.available !== undefined) updateData.available = req.body.available === 'true' || req.body.available === true;
    if (req.body.ingredients) updateData.ingredients = typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients;

    if (req.file) {
      if (dish.imagePublicId) await cloudinary.uploader.destroy(dish.imagePublicId).catch(() => {});
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await Dish.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/dishes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: 'Dish not found' });
    if (dish.imagePublicId) await cloudinary.uploader.destroy(dish.imagePublicId).catch(() => {});
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
