export const validateCAS = (data: any) => {

    if (!data.transactions) {
        throw new Error('Transactions missing');
    }

    return true;
};