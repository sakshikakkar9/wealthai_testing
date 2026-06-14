import path from 'path';

import { detectBroker } from '../imports/shared/brokerDetector';

import { parseZerodhaContractNote } from '../imports/brokers/zerodha/contract_note.parser';
// import { parseGrowwContractNote } from '../imports/brokers/groww/contract_note.parser';
// import { parseGrowwContractNote } from '../imports/brokers/groww/contract_note.parser';
// import { parseGrowwContractNote } from '../imports/brokers/groww/contract_note.parser';
import { parseZerodhaHoldings } from '../imports/brokers/zerodha/holdings.parser';

export const processContractNote = async (file: Express.Multer.File) => {

    const broker = await detectBroker(file.path);

    let trades: any[] = [];

    switch (broker) {

        case 'zerodha':
            trades = await parseZerodhaContractNote(file.path);
            break;

        case 'groww':
            // trades = await parseGrowwContractNote(file.path);
            break;

        default:
            throw new Error('Unsupported broker');
    }

    // TODO:
    // Save trades into DB
    // Create import job
    // Add reconciliation

    return {
        broker,
        totalTrades: trades.length,
        trades
    };
};

export const processHoldings = async (file: Express.Multer.File) => {

    const broker = await detectBroker(file.path);

    let holdings: any[] = [];

    switch (broker) {

        case 'zerodha':
            holdings = await parseZerodhaHoldings(file.path);
            break;

        default:
            throw new Error('Unsupported broker');
    }

    return {
        broker,
        totalHoldings: holdings.length,
        holdings
};
}