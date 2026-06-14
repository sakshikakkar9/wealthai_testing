import express from 'express';
import multer from 'multer';

import {
    importCAS
} from '../controllers/import.controller';

const router = express.Router();

const upload = multer({
    dest: 'uploads/'
});

router.post(
    '/cas',
    upload.single('file'),
    importCAS
);

export default router;