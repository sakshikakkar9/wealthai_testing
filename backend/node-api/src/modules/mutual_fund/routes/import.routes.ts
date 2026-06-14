const express = require('express');
const multer = require('multer');

const {
    importCAS
} = require('../controllers/import.controller');

const router = express.Router();

const upload = multer({
    dest: 'uploads/'
});

router.post(
    '/cas',
    upload.single('file'),
    importCAS
);

module.exports = router;
