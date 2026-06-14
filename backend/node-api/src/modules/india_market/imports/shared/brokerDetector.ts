import fs from 'fs';

export const detectBroker = async (filePath: string): Promise<string> => {

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    if (fileContent.includes('ZERODHA')) {
        return 'zerodha';
    }

    if (fileContent.includes('GROWW')) {
        return 'groww';
    }

    throw new Error('Broker could not be detected');
};