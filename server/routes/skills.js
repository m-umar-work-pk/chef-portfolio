const express = require('express');
const { cloudinary, createUpload } = require('../config/cloudinary');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = createUpload('skills', { width: 400, height: 400, crop: 'limit' });

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/skills
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const skillData = { ...req.body };
    if (req.file) {
      skillData.image = req.file.path;
      skillData.imagePublicId = req.file.filename;
    }
    const skill = await Skill.create(skillData);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/skills/:id
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (skill.imagePublicId) await cloudinary.uploader.destroy(skill.imagePublicId).catch(() => {});
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await Skill.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/skills/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    if (skill.imagePublicId) await cloudinary.uploader.destroy(skill.imagePublicId).catch(() => {});
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
