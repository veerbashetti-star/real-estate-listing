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

/* ------------------ PUBLIC ROUTES (NO AUTH) ------------------ */

// GET /api/properties
router.get('/', listProperties);

// GET /api/properties/:id
router.get('/:id', getProperty);

/* ------------------ AUTH MIDDLEWARE APPLIED BELOW ------------------ */
router.use(auth);

/* ------------------ PROTECTED ROUTES ------------------ */

// configure multer for uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/properties
router.post(
  '/',
  role(['seller', 'agent', 'admin']),
  upload.array('images', 6),
  createProperty
);

// PUT /api/properties/:id
router.put('/:id', updateProperty);

// DELETE /api/properties/:id
router.delete('/:id', deleteProperty);

// PUT /api/properties/:id/approve
router.put('/:id/approve', role(['admin']), approveProperty);

module.exports = router;
