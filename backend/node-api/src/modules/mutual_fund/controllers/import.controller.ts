import { Request, Response } from 'express';
import * as importService from '../services/import.service';

export const importCAS = async (req: Request, res: Response) => {

    try {

        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'File is required'
            });
        }

        const result = await importService.processCAS(file);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};