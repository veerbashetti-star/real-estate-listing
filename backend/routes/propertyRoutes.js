const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  createProperty,
  listProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  approveProperty
} = require('../controllers/propertyController');

// GET /api/properties - list (approved for public)
router.get('/', auth, listProperties);

// configure multer for uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage })

// POST /api/properties - create (seller/agent)
router.post('/', auth, role(['seller','agent','admin']), upload.array('images', 6), createProperty);

// GET /api/properties/:id
router.get('/:id', auth, getProperty);

// PUT /api/properties/:id
router.put('/:id', auth, updateProperty);

// DELETE /api/properties/:id
router.delete('/:id', auth, deleteProperty);

// PUT /api/properties/:id/approve - admin only
router.put('/:id/approve', auth, role(['admin']), approveProperty);

module.exports = router;
