const express = require('express');
const multer = require('multer');

const {
    importContractNote,
    importHoldings
} = require('../controllers/import.controller');

const router = express.Router();

const upload = multer({
    dest: 'uploads/'
});

router.post(
    '/contract-note',
    upload.single('file'),
    importContractNote
);

router.post(
    '/holdings',
    upload.single('file'),
    importHoldings
);

module.exports = router;
