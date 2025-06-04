'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TradeModal } from '@/components/TradeModal';
import { Stock } from '@/lib/types';
import { Portfolio } from '@/components/Portfolio';
import { TradeHistory } from '@/components/TradeHistory';

export default function TradingDashboard() {
  const { stocks, user } = useStore();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const handleTrade = (stock: Stock, type: 'buy' | 'sell') => {
    setSelectedStock(stock);
    setTradeType(type);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Dashboard</CardTitle>
          <CardDescription>Please log in to start trading</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trading Dashboard</CardTitle>
          <CardDescription>Balance: ${user.balance.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{stock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${stock.price.toFixed(2)}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleTrade(stock, 'buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTrade(stock, 'sell')}
                  >
                    Sell
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Portfolio />
      </div>
      <div className="mt-4">
        <TradeHistory />
      </div>
      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          type={tradeType}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </>
  );
}
