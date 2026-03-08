const express = require('express');
const router = express.Router();
const { getExperts, getExpertById, searchExperts, updateExpert } = require('../controllers/expertController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getExperts);
router.get('/search', searchExperts);
router.get('/:id', getExpertById);
router.put('/:id', protect, upload.single('profileImage'), updateExpert);

module.exports = router;
