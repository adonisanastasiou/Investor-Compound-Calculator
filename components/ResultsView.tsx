import React from 'react';
import { CalculationResult } from '../types';
import { GrowthChart } from './GrowthChart';

interface Props {
  result: CalculationResult;
}

export const ResultsView: React.FC<Props> = ({ result }) => {
  const formatCurrency = (val: number) => {
    if (isNaN(val)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
          <p className="text-blue-100 text-sm font-medium mb-1">Future Value</p>
          <p className="text-3xl font-bold tracking-tight">{formatCurrency(result.endBalance)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Contributions</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(result.totalPrincipal)}</p>
          <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full" 
              style={{ width: `${Math.min((result.totalPrincipal / result.endBalance) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Interest Earned</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalInterest)}</p>
           <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full rounded-full" 
              style={{ width: `${Math.min((result.totalInterest / result.endBalance) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Growth Projection</h3>
            <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-slate-600">Principal</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-slate-600">Interest</span>
                </div>
            </div>
        </div>
        <GrowthChart data={result.yearlyData} />
      </div>
    </div>
  );
};