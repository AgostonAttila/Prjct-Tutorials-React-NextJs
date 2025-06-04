'use client';

import { useStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TradeHistory() {
  const { trades } = useStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <CardDescription>Your recent trading activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trades.map((trade, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">
                  {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.symbol}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {trade.quantity} shares @ ${trade.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${(trade.quantity * trade.price).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {trade.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {trades.length === 0 && (
            <p className=" text-sm text-muted-foreground">
              No trading activity yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
