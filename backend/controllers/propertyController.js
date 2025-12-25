/**
 * Property Controller
 * Endpoints:
 * POST /api/properties       -> create property (seller/agent)
 * GET  /api/properties       -> list approved properties (or all if admin)
 * GET  /api/properties/:id   -> get property details
 * PUT  /api/properties/:id   -> update property (owner or admin)
 * DELETE /api/properties/:id -> delete property (owner or admin)
 * PUT  /api/properties/:id/approve -> admin approves property
 */
const Property = require('../models/Property');

const createProperty = async (req, res) => {
  try {
    const data = req.body || {};
    data.owner = req.user._id;
    data.status = 'pending';
    // handle uploaded files (if any)
    if (req.files && req.files.length) {
      data.images = req.files.map(f => {
        // store accessible path
        return `/uploads/${f.filename}`
      })
    }
    const prop = await Property.create(data);
    res.status(201).json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listProperties = async (req, res) => {
  try {
    const { search, propertyType, minPrice, maxPrice, status } = req.query;
    const filter = {};
    if (req.user && req.user.role === 'admin' && status) {
      filter.status = status;
    } else {
      filter.status = 'approved';
    }
    if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { location: new RegExp(search, 'i') }];
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    const props = await Property.find(filter).populate('owner', 'name email phone');
    res.json(props);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id).populate('owner', 'name email phone');
    if (!prop) return res.status(404).json({ message: 'Not found' });
    if (prop.status !== 'approved' && (!req.user || req.user.role !== 'admin') ) {
      return res.status(403).json({ message: 'Not visible' });
    }
    res.json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });
    if (String(prop.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    Object.assign(prop, req.body);
    await prop.save();
    res.json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });
    if (String(prop.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await prop.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Not found' });
    prop.status = req.body.status || 'approved';
    await prop.save();
    res.json(prop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProperty, listProperties, getProperty, updateProperty, deleteProperty, approveProperty };
