require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Seed data on first run
async function seedAll() {
  try {
    const Admin = require('./models/Admin');
    const Skill = require('./models/Skill');
    const Experience = require('./models/Experience');
    const Dish = require('./models/Dish');

    if (!(await Admin.findOne())) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@muhammadumair.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        name: 'Chef Umair',
      });
    }

    if ((await Skill.countDocuments()) === 0) {
      await Skill.insertMany([
        { name: 'Pakistani Cuisine', emoji: '🇵🇰', level: 98, order: 1 },
        { name: 'Italian Cuisine', emoji: '🇮🇹', level: 95, order: 2 },
        { name: 'Continental Cuisine', emoji: '🌍', level: 92, order: 3 },
        { name: 'French Techniques', emoji: '🇫🇷', level: 88, order: 4 },
        { name: 'BBQ and Grill', emoji: '🔥', level: 90, order: 5 },
        { name: 'Mediterranean', emoji: '🫒', level: 85, order: 6 },
      ]);
    }

    if ((await Experience.countDocuments()) === 0) {
      await Experience.insertMany([
        { year: '2014', title: 'Culinary Academy', description: 'Graduated top of class from Le Cordon Bleu with honors in Culinary Arts', order: 1 },
        { year: '2016', title: 'Junior Chef', description: 'Refined French cuisine techniques at Le Petit Bistro, Paris', order: 2 },
        { year: '2018', title: 'Sous Chef', description: 'Led kitchen operations for 200+ covers daily at The Grand Hotel', order: 3 },
        { year: '2020', title: 'Executive Chef', description: 'Promoted to Executive Chef, managing full kitchen brigade of 15+', order: 4 },
        { year: '2022', title: 'Culinary Consultant', description: 'Opened own restaurant and consulting for top hotels in Karachi', order: 5 },
        { year: '2024', title: 'Award-Winning Chef', description: 'Recognized among Top 100 Chefs globally', order: 6 },
      ]);
    }

    if ((await Dish.countDocuments()) === 0) {
      await Dish.insertMany([
        { name: 'Bruschetta Trio', description: 'Classic tomato basil, wild mushroom, and roasted pepper bruschetta', category: 'Appetizer', ingredients: ['Ciabatta', 'Tomatoes', 'Basil'] },
        { name: 'Grilled Calamari', description: 'Tender calamari rings grilled with garlic aioli and fresh lemon', category: 'Appetizer', featured: true, ingredients: ['Calamari', 'Garlic aioli', 'Lemon'] },
        { name: 'Lamb Shank Risotto', description: 'Braised lamb shank over creamy arborio risotto with rosemary', category: 'Main Course', featured: true, ingredients: ['Lamb shank', 'Arborio rice', 'Rosemary'] },
        { name: 'Grilled Salmon', description: 'Pan-seared Atlantic salmon on creamy mushroom risotto', category: 'Main Course', featured: true, ingredients: ['Salmon', 'Mushrooms', 'Risotto'] },
        { name: 'Chicken Alfredo', description: 'Creamy Alfredo sauce with fettuccine and grilled chicken', category: 'Main Course', ingredients: ['Fettuccine', 'Chicken', 'Parmesan'] },
        { name: 'Beef Wellington', description: 'Tender beef in mushroom duxelles and golden puff pastry', category: 'Main Course', featured: true, ingredients: ['Beef', 'Mushroom', 'Puff pastry'] },
        { name: 'Tandoori Platter', description: 'Mixed grill of tandoori chicken, seekh kebab, and lamb chops', category: 'Main Course', ingredients: ['Chicken', 'Kebab', 'Lamb chops'] },
        { name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', category: 'Dessert', featured: true, ingredients: ['Ladyfingers', 'Espresso', 'Mascarpone'] },
        { name: 'Chocolate Lava Cake', description: 'Rich dark chocolate fondant with molten center', category: 'Dessert', featured: true, ingredients: ['Dark chocolate', 'Butter', 'Eggs'] },
        { name: 'Gulab Jamun', description: 'Soft milk dumplings in rose-flavored sugar syrup', category: 'Dessert', ingredients: ['Milk powder', 'Sugar syrup', 'Rose water'] },
        { name: 'Signature Seafood Platter', description: 'Chef exclusive lobster, prawns, and scallops with truffle butter', category: 'Special', featured: true, ingredients: ['Lobster', 'Prawns', 'Scallops'] },
        { name: 'Chef Lamb Chops', description: 'Herb-crusted lamb chops with red wine reduction', category: 'Special', featured: true, ingredients: ['Lamb chops', 'Rosemary', 'Red wine'] },
        { name: 'Mango Lassi', description: 'Refreshing Pakistani yogurt drink with fresh mango', category: 'Beverage', ingredients: ['Mango', 'Yogurt', 'Cardamom'] },
      ]);
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
}

module.exports = { app, seedAll };
