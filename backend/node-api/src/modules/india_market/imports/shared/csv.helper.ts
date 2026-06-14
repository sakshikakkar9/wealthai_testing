import csv from 'csv-parser';
import fs from 'fs';

export const parseCSV = (filePath: string): Promise<any[]> => {

    return new Promise((resolve, reject) => {

        const rows: any[] = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => rows.push(data))
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
};