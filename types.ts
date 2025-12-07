export enum CompoundFrequency {
  Annually = 1,
  Semiannually = 2,
  Quarterly = 4,
  Monthly = 12,
  Daily = 365,
}

export interface CalculatorInputs {
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  interestRate: number;
  compoundFrequency: CompoundFrequency;
}

export interface YearlyData {
  year: number;
  totalPrincipal: number; // Initial + Contributions
  totalInterest: number;
  balance: number;
}

export interface CalculationResult {
  endBalance: number;
  totalPrincipal: number;
  totalInterest: number;
  yearlyData: YearlyData[];
}