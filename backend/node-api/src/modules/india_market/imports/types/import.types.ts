export interface NormalizedTrade {
    symbol: string;
    exchange: string;
    quantity: number;
    price: number;
    tradeType: 'BUY' | 'SELL';
    orderDate: string;
}

export interface NormalizedHolding {
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: number;
}