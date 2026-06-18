import express from 'express';
import multer from 'multer';

import {
    importContractNote,
    importHoldings
} from '../controllers/import.controller';

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
