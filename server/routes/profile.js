const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        name: 'Muhammad Umair',
        title: 'Professional Chef',
        bio: 'A passionate and creative professional chef with over 10 years of culinary experience. Specializing in Continental, Italian, and Pakistani cuisine.',
        experience: 10,
        speciality: 'Continental, Italian, and Pakistani Cuisine',
      });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
