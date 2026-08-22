const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

// GET /api/experience - Public
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/experience - Admin
router.post('/', auth, async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json({ success: true, data: exp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/experience/:id - Admin
router.put('/:id', auth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, data: exp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/experience/:id - Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
