'use client';

import {
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

interface ChartContentProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  dataKeys: string[];
  showPercentages: boolean;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function ChartContent({
  data,
  type,
  dataKeys,
  showPercentages,
}: ChartContentProps) {
  // Use either normalized or raw data based on showPercentages prop
  const chartData = showPercentages
    ? data.map((point, index, array) => {
        // Skip processing if no data points
        if (array.length === 0) return point;

        const normalized: any = { time: point.time };

        dataKeys.forEach((key) => {
          // Get the first valid value for this key
          const baseValue = array.find((p) => p[key] !== undefined)?.[key];
          if (baseValue === undefined) return;

          const currentValue = point[key];
          if (currentValue === undefined) return;

          // Calculate percentage change from base value
          normalized[key] = (currentValue / baseValue) * 100;
        });

        return normalized;
      })
    : data;

  const renderChart = (dataKey: string, index: number) => {
    const color = COLORS[index % COLORS.length];

    switch (type) {
      case 'line':
        return (
          <Line
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        );
      case 'area':
        return (
          <Area
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            dot={false}
          />
        );
      case 'bar':
        return (
          <Bar key={dataKey} dataKey={dataKey} fill={color} fillOpacity={0.8} />
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--muted-foreground))"
          opacity={0.2}
        />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          opacity={0.5}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          opacity={0.5}
          domain={showPercentages ? [80, 120] : ['auto', 'auto']}
          tick={{ fontSize: 12 }}
          width={45}
          tickFormatter={(value) => (showPercentages ? `${value}%` : value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number) => [
            showPercentages ? `${value.toFixed(2)}%` : value.toFixed(2),
          ]}
        />
        {dataKeys.map((dataKey, index) => renderChart(dataKey, index))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
