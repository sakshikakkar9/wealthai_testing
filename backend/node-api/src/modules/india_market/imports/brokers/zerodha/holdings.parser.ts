import { parseCSV } from '../../shared/csv.helper';

export const parseZerodhaHoldings = async (filePath: string) => {

    const rows = await parseCSV(filePath);

    return rows.map((row) => ({
        symbol: row.Symbol,
        quantity: Number(row.Quantity),
        averagePrice: Number(row.AveragePrice)
    }));
};