import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CalculationResult, CalculatorInputs } from '../types';

interface Props {
  inputs: CalculatorInputs;
  result: CalculationResult;
}

export const AIAdvisor: React.FC<Props> = ({ inputs, result }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const generateAdvice = async () => {
    setIsLoading(true);
    setAdvice('');
    setHasError(false);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Act as a friendly, expert financial advisor. 
        Analyze the following investment scenario:
        - Initial Investment: $${inputs.initialInvestment}
        - Monthly Contribution: $${inputs.monthlyContribution}
        - Time Period: ${inputs.years} years
        - Interest Rate: ${inputs.interestRate}%
        - Compound Frequency: ${inputs.compoundFrequency} times/year
        
        Result:
        - Future Value: $${result.endBalance.toFixed(2)}
        - Total Interest Earned: $${result.totalInterest.toFixed(2)}
        
        Provide a concise, encouraging, and insightful summary (max 150 words). 
        Highlight the power of compound interest in this specific scenario. 
        Use markdown for formatting. 
        Do not give specific legal/financial advice, but rather educational insights.
      `;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          setAdvice(prev => prev + chunk.text);
        }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      setHasError(true);
      setAdvice("I'm sorry, I couldn't generate an insight at this moment. Please check your API configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm mt-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-200 rounded-full opacity-20 blur-xl"></div>

        <div className="flex items-start gap-4 relative z-10">
            <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M8 10h.01"></path>
                    <path d="M12 10h.01"></path>
                    <path d="M16 10h.01"></path>
                </svg>
            </div>
            
            <div className="flex-1">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">AI Financial Insight</h3>
                
                {!advice && !isLoading && (
                    <div className="text-indigo-700/80">
                        <p className="mb-4 text-sm">Want to understand what these numbers mean for your future? I can analyze this scenario for you.</p>
                        <button 
                            onClick={generateAdvice}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span>Generate Analysis</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                        <div className="h-4 bg-indigo-200 rounded w-full"></div>
                        <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                    </div>
                )}

                {advice && (
                    <div className="prose prose-sm text-indigo-900 max-w-none">
                        <div dangerouslySetInnerHTML={{ 
                            __html: advice
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br />') 
                        }} />
                    </div>
                )}
                
                {hasError && (
                   <p className="text-red-500 text-sm mt-2">{advice}</p>
                )}
            </div>
        </div>
    </div>
  );
};
