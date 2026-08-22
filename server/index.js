require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const { app, seedAll } = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Static files and catch-all for local/production
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      await seedAll();
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB error:', err.message);
      process.exit(1);
    });
} else {
  console.error('MONGODB_URI not set');
  process.exit(1);
}
