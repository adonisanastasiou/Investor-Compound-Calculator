import React from 'react';
import { CalculatorInputs, CompoundFrequency } from '../types';

interface Props {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  onCalculate: () => void;
}

export const CalculatorForm: React.FC<Props> = ({ inputs, setInputs, onCalculate }) => {
  const handleChange = (field: keyof CalculatorInputs, value: string | number) => {
    // If empty string, keep it as 0 or handle effectively, but here we just parse
    let parsedValue: number | any = value;
    if (typeof value === 'string') {
        parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) parsedValue = 0;
    }
    
    setInputs(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
            Investment Parameters
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Initial Investment */}
            <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Initial Investment</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                type="number"
                min="0"
                value={inputs.initialInvestment}
                onChange={(e) => handleChange('initialInvestment', e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-800 font-medium"
                />
            </div>
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Monthly Contribution</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                type="number"
                min="0"
                value={inputs.monthlyContribution}
                onChange={(e) => handleChange('monthlyContribution', e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-800 font-medium"
                />
            </div>
            </div>

            {/* Years to Grow */}
            <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Length of Time (Years)</label>
            <input
                type="number"
                min="1"
                max="100"
                value={inputs.years}
                onChange={(e) => handleChange('years', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-800 font-medium"
            />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Estimated Interest Rate (%)</label>
            <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => handleChange('interestRate', e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-800 font-medium"
            />
            </div>

            {/* Compound Frequency */}
            <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-600">Compound Frequency</label>
            <select
                value={inputs.compoundFrequency}
                onChange={(e) => handleChange('compoundFrequency', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-800 font-medium cursor-pointer"
            >
                <option value={CompoundFrequency.Annually}>Annually</option>
                <option value={CompoundFrequency.Semiannually}>Semiannually</option>
                <option value={CompoundFrequency.Quarterly}>Quarterly</option>
                <option value={CompoundFrequency.Monthly}>Monthly</option>
                <option value={CompoundFrequency.Daily}>Daily</option>
            </select>
            </div>
        </div>

        <div className="pt-2">
            <button
            onClick={onCalculate}
            className="w-full md:w-auto md:px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] text-lg flex justify-center items-center gap-2 mx-auto"
            >
            <span>Calculate</span>
            </button>
        </div>
      </div>
    </div>
  );
};