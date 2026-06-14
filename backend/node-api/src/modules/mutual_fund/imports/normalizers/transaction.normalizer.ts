export const normalizeTransaction = (transaction: any) => {

    return {
        folioNumber: transaction.folio_number,
        schemeName: transaction.scheme_name,
        transactionType: transaction.transaction_type,
        amount: transaction.amount,
        units: transaction.units,
        nav: transaction.nav
    };
};