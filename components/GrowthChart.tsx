import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { YearlyData } from '../types';

interface Props {
  data: YearlyData[];
}

export const GrowthChart: React.FC<Props> = ({ data }) => {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="h-[400px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="year" 
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickMargin={10}
            label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            width={60}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
               if (name === 'Total Principal') return [`$${Math.round(value).toLocaleString()}`, 'Principal'];
               if (name === 'Total Interest') return [`$${Math.round(value).toLocaleString()}`, 'Interest'];
               return [value, name];
            }}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '8px 12px'
            }}
          />
          
          <Area
            type="monotone"
            dataKey="totalPrincipal"
            name="Total Principal"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#colorPrincipal)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="totalInterest"
            name="Total Interest"
            stackId="1"
            stroke="#22c55e"
            fill="url(#colorInterest)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};