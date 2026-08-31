const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

let messages = [];
let idCounter = 1;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'pro.chef.umair@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '',
  },
});

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message, eventType } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  messages.push({ id: idCounter++, name, email, phone, subject, message, eventType, date: new Date() });

  try {
    const mailSubject = subject || `New Contact Message from ${name}`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #b8860b, #D4AF37); padding: 24px; text-align: center; }
  .header h1 { color: #0a0a0f; margin: 0; font-size: 22px; }
  .header p { color: #0a0a0f; margin: 5px 0 0; font-size: 13px; opacity: 0.8; }
  .body { padding: 24px; }
  .field { margin-bottom: 16px; }
  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #b8860b; font-weight: bold; margin-bottom: 4px; }
  .value { font-size: 14px; color: #333; line-height: 1.6; }
  .message-box { background: #f9f9f9; border-left: 4px solid #D4AF37; padding: 16px; border-radius: 0 8px 8px 0; margin-top: 8px; }
  .footer { background: #0a0a0f; padding: 16px; text-align: center; }
  .footer p { color: #888; font-size: 11px; margin: 0; }
  .footer a { color: #D4AF37; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Chef Muhammad Umair</h1>
    <p>New Message from Contact Form</p>
  </div>
  <div class="body">
    <div class="field">
      <div class="label">From</div>
      <div class="value">${name}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${email}">${email}</a></div>
    </div>
    ${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ''}
    <div class="field">
      <div class="label">Subject</div>
      <div class="value">${mailSubject}</div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="message-box">${message}</div>
    </div>
  </div>
  <div class="footer">
    <p>Sent via <a href="https://chef-portfolio-umair.vercel.app">Chef Umair Portfolio</a></p>
  </div>
</div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"${name}" <${process.env.ADMIN_EMAIL || 'pro.chef.umair@gmail.com'}>`,
      to: process.env.ADMIN_EMAIL || 'pro.chef.umair@gmail.com',
      replyTo: email,
      subject: mailSubject,
      html: htmlBody,
    });

    res.json({ success: true, message: 'Message sent successfully! Chef Umair will get back to you soon.' });
  } catch (err) {
    console.error('Email send error:', err.message);
    res.json({ success: true, message: 'Message received! Chef Umair will get back to you soon.' });
  }
});

router.get('/', auth, (req, res) => {
  res.json({ success: true, count: messages.length, data: messages });
});

module.exports = router;
