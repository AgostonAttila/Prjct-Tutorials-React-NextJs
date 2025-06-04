'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Stock } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface TradeModalProps {
  stock: Stock;
  type: 'buy' | 'sell';
  onClose: () => void;
}

export function TradeModal({ stock, type, onClose }: TradeModalProps) {
  const [quantity, setQuantity] = useState('1');
  const { user, setUser, addTrade } = useStore();
  const { toast } = useToast();

  const handleTrade = () => {
    if (!user) return;

    const qty = parseInt(quantity);
    const total = qty * stock.price;

    if (type === 'buy') {
      if (total > user.balance) {
        toast({
          title: 'Insufficient funds',
          description: 'You do not have enough balance for this trade.',
          variant: 'destructive',
        });
        return;
      }

      setUser({
        ...user,
        balance: user.balance - total,
        portfolio: {
          ...user.portfolio,
          [stock.symbol]: {
            quantity: (user.portfolio[stock.symbol]?.quantity || 0) + qty,
            averagePrice:
              ((user.portfolio[stock.symbol]?.averagePrice || 0) *
                (user.portfolio[stock.symbol]?.quantity || 0) +
                total) /
              ((user.portfolio[stock.symbol]?.quantity || 0) + qty),
          },
        },
      });
    } else {
      const currentQty = user.portfolio[stock.symbol]?.quantity || 0;
      if (qty > currentQty) {
        toast({
          title: 'Insufficient shares',
          description: 'You do not have enough shares for this trade.',
          variant: 'destructive',
        });
        return;
      }

      const newQty = currentQty - qty;
      const newPortfolio = { ...user.portfolio };
      if (newQty === 0) {
        delete newPortfolio[stock.symbol];
      } else {
        newPortfolio[stock.symbol] = {
          ...newPortfolio[stock.symbol],
          quantity: newQty,
        };
      }

      setUser({
        ...user,
        balance: user.balance + total,
        portfolio: newPortfolio,
      });
    }

    addTrade({
      symbol: stock.symbol,
      quantity: qty,
      price: stock.price,
      type,
      timestamp: new Date(),
    });

    toast({
      title: 'Trade executed',
      description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${qty} shares of ${stock.symbol}`,
    });

    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="quantity">Quantity</label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="text-sm">
            Total: ${(parseInt(quantity) * stock.price).toFixed(2)}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleTrade}>
            {type === 'buy' ? 'Buy' : 'Sell'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}