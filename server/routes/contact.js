const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let messages = [];
let idCounter = 1;

router.post('/', (req, res) => {
  const { name, email, phone, subject, message, eventType } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }
  messages.push({ id: idCounter++, name, email, phone, subject, message, eventType, date: new Date() });
  res.json({ success: true, message: 'Message received successfully' });
});

router.get('/', auth, (req, res) => {
  res.json({ success: true, count: messages.length, data: messages });
});

module.exports = router;
