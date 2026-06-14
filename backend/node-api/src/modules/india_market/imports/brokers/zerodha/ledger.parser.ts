import { parseCSV } from '../../shared/csv.helper';

export const parseZerodhaLedger = async (filePath: string) => {

    const rows = await parseCSV(filePath);

    return rows.map((row) => ({
        date: row.Date,
        narration: row.Narration,
        debit: Number(row.Debit || 0),
        credit: Number(row.Credit || 0),
        balance: Number(row.Balance || 0)
    }));
};