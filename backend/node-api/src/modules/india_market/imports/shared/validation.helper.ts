export const validateTradeRow = (row: any) => {

    if (!row.symbol) {
        throw new Error('Symbol missing');
    }

    if (!row.quantity) {
        throw new Error('Quantity missing');
    }

    return true;
};