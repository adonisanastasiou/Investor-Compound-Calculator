import React, { useState, useEffect } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsView } from './components/ResultsView';
import { CalculatorInputs, CalculationResult, CompoundFrequency } from './types';
import { calculateCompoundInterest } from './utils/calculations';

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    years: 20,
    interestRate: 7,
    compoundFrequency: CompoundFrequency.Annually
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Initial calculation on mount
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = () => {
    const res = calculateCompoundInterest(inputs);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4rem] py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
              $
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-tight">
              Investor Calculator By Adonis Business Academy
            </h1>
          </div>
          <a href="https://adonisanastasiou.com/" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors text-right shrink-0">
            Inspired by Adonis Anastasiou
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Compound Interest Calculator</h2>
            <p className="text-slate-600 text-lg">
                Visualize how your money can grow over time with the power of compound interest. 
            </p>
        </div>

        {/* Form Section */}
        <CalculatorForm 
          inputs={inputs} 
          setInputs={setInputs} 
          onCalculate={handleCalculate} 
        />

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in space-y-8">
            <ResultsView result={result} />
            
            {/* Info / Disclaimer */}
            <div className="bg-slate-100 p-6 rounded-xl text-slate-500 text-sm leading-relaxed border border-slate-200 text-center max-w-3xl mx-auto">
                <p className="font-semibold mb-2 text-slate-700">Disclaimer</p>
                <p>
                    This calculator is for educational purposes only. It assumes a fixed rate of return and does not account for 
                    inflation, taxes, or market volatility. Actual investment returns 
                    will vary. Please consult a qualified financial professional for personalized advice.
                </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;