'use client';

import { useStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Portfolio() {
  const { user, stocks } = useStore();

  if (!user) return null;

  const getStockCurrentPrice = (symbol: string) => {
    return stocks.find((s) => s.symbol === symbol)?.price || 0;
  };

  const calculatePositionValue = (symbol: string, quantity: number) => {
    const currentPrice = getStockCurrentPrice(symbol);
    return currentPrice * quantity;
  };

  const calculateProfitLoss = (symbol: string) => {
    const position = user.portfolio[symbol];
    if (!position) return 0;
    const currentValue = calculatePositionValue(symbol, position.quantity);
    const costBasis = position.averagePrice * position.quantity;
    return currentValue - costBasis;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
        <CardDescription>Current positions and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(user.portfolio).map(([symbol, position]) => (
            <div
              key={symbol}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{symbol}</h3>
                <p className="text-sm text-muted-foreground">
                  {position.quantity} shares @ $
                  {position.averagePrice.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  $
                  {calculatePositionValue(symbol, position.quantity).toFixed(2)}
                </p>
                <p
                  className={`text-sm ${
                    calculateProfitLoss(symbol) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {calculateProfitLoss(symbol) >= 0 ? '+' : ''}$
                  {calculateProfitLoss(symbol).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {Object.keys(user.portfolio).length === 0 && (
            <p className="text-sm text-muted-foreground">
              No positions yet. Start trading to build your portfolio!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
