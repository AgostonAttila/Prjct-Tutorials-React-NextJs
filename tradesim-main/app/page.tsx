import { Suspense } from 'react';
import MarketOverview from '@/components/MarketOverview';
import TradingDashboard from '@/components/TradingDashboard';
import { StockChart } from '@/components/StockChart';
import { ConnectionStatus } from '@/components/ConnectionStatus';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ConnectionStatus />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">TradeSim Trading Platform</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Suspense fallback={<div>Loading market data...</div>}>
              <MarketOverview />
            </Suspense>
            <div className="mt-8">
              <Suspense fallback={<div>Loading chart...</div>}>
                <StockChart />
              </Suspense>
            </div>
          </div>
          <div className="lg:col-span-4">
            <Suspense fallback={<div>Loading trading dashboard...</div>}>
              <TradingDashboard />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
