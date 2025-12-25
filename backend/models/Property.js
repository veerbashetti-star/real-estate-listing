const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  area: { type: Number },
  propertyType: { type: String, enum: ['Flat','House','Land','Commercial'], default: 'Flat' },
  images: { type: [String], default: [] },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
