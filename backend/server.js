const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const User = require('./models/User');
const Property = require('./models/Property');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const path = require('path');

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

connectDB();

app.get('/', (req, res) => res.send('Real Estate API running'));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    // create admin user if not exists
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@realestate.test');
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASS || 'admin123', 10);
      await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
      console.log('Created admin user:', adminEmail);
    }
    // create sample property if none
    const count = await Property.countDocuments();
    if (count === 0) {
      const owner = await User.findOne({ role: 'admin' });
      await Property.create({
        title: 'Sample 2BHK Apartment',
        description: 'A sample approved apartment',
        price: 50000,
        location: 'Sample City',
        area: 950,
        propertyType: 'Flat',
        images: [],
        status: 'approved',
        owner: owner ? owner._id : undefined
      });
      console.log('Created sample property');
    }
  } catch (err) {
    console.error('Seed error', err);
  }
});
