'use client';

import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, AreaChart } from 'lucide-react';

type ChartType = 'line' | 'area' | 'bar';

interface ChartTypeSelectorProps {
  activeType: ChartType;
  onChange?: (type: ChartType) => void;
}

export function ChartTypeSelector({
  activeType,
  onChange,
}: ChartTypeSelectorProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={activeType === 'area' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange?.('area')}
      >
        <AreaChart className="h-4 w-4 mr-1" />
        Area
      </Button>
      <Button
        variant={activeType === 'line' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange?.('line')}
      >
        <LineChart className="h-4 w-4 mr-1" />
        Line
      </Button>
      <Button
        variant={activeType === 'bar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange?.('bar')}
      >
        <BarChart3 className="h-4 w-4 mr-1" />
        Bar
      </Button>
    </div>
  );
}
