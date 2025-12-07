import { CalculatorInputs, CalculationResult, YearlyData, CompoundFrequency } from '../types';

const calculateTrajectory = (
  inputs: CalculatorInputs
): { endBalance: number, yearlyData: YearlyData[] } => {
  const {
    initialInvestment,
    monthlyContribution,
    years,
    compoundFrequency,
    interestRate
  } = inputs;

  const r_decimal = interestRate / 100;
  const totalMonths = years * 12;

  // Current actual balance of the account
  let currentBalance = initialInvestment;
  
  // Total cash contributed (Principal)
  let totalPrincipal = initialInvestment;
  
  // For Low-Frequency compounding (Annual, Semi, Quarterly), 
  // interest is usually calculated on the balance at the START of the compounding period.
  // We track this separately.
  let principalAtStartOfCompoundingPeriod = initialInvestment;

  const dataPoints: YearlyData[] = [];

  // Year 0 (Start)
  dataPoints.push({
    year: 0,
    totalPrincipal: initialInvestment,
    totalInterest: 0,
    balance: initialInvestment
  });

  for (let m = 1; m <= totalMonths; m++) {
    // 1. Add Monthly Contribution
    // In most "Investor" calculators, monthly contributions are added 
    // effectively at the start of the month for cash-flow purposes,
    // but their interest-earning capability depends on the compounding frequency.
    currentBalance += monthlyContribution;
    totalPrincipal += monthlyContribution;

    // 2. Apply Interest Logic
    if (compoundFrequency >= 12) {
      // High Frequency (Monthly = 12, Daily = 365)
      // Logic: Contributions earn interest immediately in the month they are deposited (Beginning of Month)
      
      let growthFactor = 0;
      
      if (compoundFrequency === CompoundFrequency.Daily) {
        // Daily Compounding
        // Approximation: Compounding daily for (365/12) days
        const dailyRate = r_decimal / 365;
        const daysInMonth = 365.0 / 12.0;
        growthFactor = Math.pow(1 + dailyRate, daysInMonth);
        
        // Apply growth
        currentBalance = currentBalance * growthFactor;
      } else {
        // Monthly Compounding
        // Simple monthly rate applied to the whole balance
        const monthlyRate = r_decimal / 12;
        const interest = currentBalance * monthlyRate;
        currentBalance += interest;
      }
      
    } else {
      // Low Frequency (Quarterly, Semiannually, Annually)
      // Logic: Interest is calculated ONLY on the balance that existed 
      // at the START of the compounding period. 
      // Contributions made *during* the period wait until the next period to compound.

      // Check if this is a compounding month
      // Annually (1): Months 12, 24, 36... (12/1 = 12)
      // Semiannually (2): Months 6, 12, 18... (12/2 = 6)
      // Quarterly (4): Months 3, 6, 9... (12/4 = 3)
      const monthsPerPeriod = 12 / compoundFrequency;
      const isCompoundingMonth = (m % monthsPerPeriod === 0);

      if (isCompoundingMonth) {
        // Calculate interest on the PRINCIPAL AT START OF PERIOD
        const periodRate = r_decimal / compoundFrequency;
        const interest = principalAtStartOfCompoundingPeriod * periodRate;
        
        // Add interest to the actual balance
        currentBalance += interest;
        
        // RESET the "Start of Period" principal to the new balance
        // (This effectively "capitalizes" the interest and the contributions made during the last period)
        principalAtStartOfCompoundingPeriod = currentBalance;
      }
    }

    // 3. Record Data (Yearly snapshots)
    if (m % 12 === 0) {
      dataPoints.push({
        year: m / 12,
        totalPrincipal: totalPrincipal,
        totalInterest: currentBalance - totalPrincipal,
        balance: currentBalance
      });
    }
  }

  return {
    endBalance: currentBalance,
    yearlyData: dataPoints
  };
};

export const calculateCompoundInterest = (inputs: CalculatorInputs): CalculationResult => {
  const mainResult = calculateTrajectory(inputs);
  
  // Explicitly recalculate total principal to avoid any floating point drift in the loop
  const exactTotalPrincipal = inputs.initialInvestment + (inputs.monthlyContribution * inputs.years * 12);
  const endBalance = mainResult.endBalance;
  
  return {
    endBalance: endBalance,
    totalPrincipal: exactTotalPrincipal,
    totalInterest: endBalance - exactTotalPrincipal,
    yearlyData: mainResult.yearlyData
  };
};