import { parseCSV } from '../../shared/csv.helper';
import { validateTradeRow } from '../../shared/validation.helper';

export const parseZerodhaContractNote = async (filePath: string) => {

    const rows = await parseCSV(filePath);

    const trades = rows.map((row) => {

        validateTradeRow(row);

        return {
            symbol: row.Symbol,
            exchange: row.Exchange,
            quantity: Number(row.Quantity),
            price: Number(row.Price),
            tradeType: row.Type,
            orderDate: row.Date
        };
    });

    return trades;
};