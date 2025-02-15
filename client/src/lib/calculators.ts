export function calculateSIP(
  monthlyInvestment: number,
  years: number,
  expectedReturn: number
): {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  monthlyData: Array<{ label: string; value: number }>;
} {
  const monthlyRate = expectedReturn / 12 / 100;
  const months = years * 12;
  
  let monthlyData = [];
  const maturityValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);
    
  const totalInvestment = monthlyInvestment * months;
  const totalReturns = maturityValue - totalInvestment;

  for (let i = 0; i <= months; i++) {
    const currentValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate) *
      (1 + monthlyRate);
    monthlyData.push({
      label: `Month ${i}`,
      value: Math.round(currentValue),
    });
  }

  return {
    totalInvestment,
    totalReturns,
    maturityValue,
    monthlyData,
  };
}

export function calculateEMI(
  principal: number,
  rate: number,
  tenure: number
): {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  monthlyData: Array<{ label: string; value: number }>;
} {
  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  
  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
    
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  let monthlyData = [];
  let remainingBalance = principal;
  
  for (let i = 0; i <= months; i++) {
    monthlyData.push({
      label: `Month ${i}`,
      value: Math.round(remainingBalance),
    });
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = emi - interestPayment;
    remainingBalance -= principalPayment;
  }

  return {
    emi,
    totalInterest,
    totalPayment,
    monthlyData,
  };
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  frequency: number
): {
  amount: number;
  interest: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const amount =
    principal * Math.pow(1 + rate / (frequency * 100), frequency * time);
  const interest = amount - principal;

  let yearlyData = [];
  for (let i = 0; i <= time; i++) {
    const currentAmount =
      principal * Math.pow(1 + rate / (frequency * 100), frequency * i);
    yearlyData.push({
      label: `Year ${i}`,
      value: Math.round(currentAmount),
    });
  }

  return {
    amount,
    interest,
    yearlyData,
  };
}

export function calculateLumpsum(
  principal: number,
  years: number,
  expectedReturn: number
): {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const annualRate = expectedReturn / 100;
  const maturityValue = principal * Math.pow(1 + annualRate, years);
  const totalReturns = maturityValue - principal;

  let yearlyData = [];
  for (let i = 0; i <= years; i++) {
    const currentValue = principal * Math.pow(1 + annualRate, i);
    yearlyData.push({
      label: `Year ${i}`,
      value: Math.round(currentValue),
    });
  }

  return {
    totalInvestment: principal,
    totalReturns,
    maturityValue,
    yearlyData,
  };
}

export function calculatePPF(
  yearlyInvestment: number,
  years: number = 15
): {
  totalInvestment: number;
  totalInterest: number;
  maturityValue: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const interestRate = 7.1 / 100; // Current PPF interest rate
  let balance = 0;
  let totalInterest = 0;
  let yearlyData = [];

  for (let i = 0; i <= years; i++) {
    if (i > 0) {
      const interest = balance * interestRate;
      totalInterest += interest;
      balance += interest + yearlyInvestment;
    }
    yearlyData.push({
      label: `Year ${i}`,
      value: Math.round(balance),
    });
  }

  return {
    totalInvestment: yearlyInvestment * years,
    totalInterest,
    maturityValue: balance,
    yearlyData,
  };
}

export function calculateFD(
  principal: number,
  rate: number,
  years: number,
  compoundingFrequency: number = 4
): {
  totalInvestment: number;
  totalInterest: number;
  maturityValue: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const ratePerPeriod = rate / (100 * compoundingFrequency);
  const totalPeriods = years * compoundingFrequency;

  const maturityValue = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
  const totalInterest = maturityValue - principal;

  let yearlyData = [];
  for (let i = 0; i <= years; i++) {
    const periods = i * compoundingFrequency;
    const currentValue = principal * Math.pow(1 + ratePerPeriod, periods);
    yearlyData.push({
      label: `Year ${i}`,
      value: Math.round(currentValue),
    });
  }

  return {
    totalInvestment: principal,
    totalInterest,
    maturityValue,
    yearlyData,
  };
}

export function calculateRD(
  monthlyInvestment: number,
  rate: number,
  years: number
): {
  totalInvestment: number;
  totalInterest: number;
  maturityValue: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  let maturityValue = 0;
  let yearlyData = [];

  for (let i = 0; i < months; i++) {
    maturityValue += monthlyInvestment * Math.pow(1 + monthlyRate, months - i);
    if (i % 12 === 0) {
      yearlyData.push({
        label: `Year ${i / 12}`,
        value: Math.round(maturityValue),
      });
    }
  }

  const totalInvestment = monthlyInvestment * months;
  const totalInterest = maturityValue - totalInvestment;

  // Add final year
  yearlyData.push({
    label: `Year ${years}`,
    value: Math.round(maturityValue),
  });

  return {
    totalInvestment,
    totalInterest,
    maturityValue,
    yearlyData,
  };
}

export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number
): {
  amount: number;
  interest: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const interest = (principal * rate * time) / 100;
  const amount = principal + interest;

  let yearlyData = [];
  for (let i = 0; i <= time; i++) {
    const currentInterest = (principal * rate * i) / 100;
    yearlyData.push({
      label: `Year ${i}`,
      value: Math.round(principal + currentInterest),
    });
  }

  return {
    amount,
    interest,
    yearlyData,
  };
}

export function calculateHRA(
  basicSalary: number,
  rentPaid: number,
  cityType: 'metro' | 'non-metro'
): {
  hraReceived: number;
  hraExemption: number;
  taxableHRA: number;
  monthlyData: Array<{ label: string; value: number }>;
} {
  const hraReceived = basicSalary * 0.4; 
  const cityMultiplier = cityType === 'metro' ? 0.5 : 0.4;
  const cityBasedExemption = basicSalary * cityMultiplier;
  const rentBasedExemption = rentPaid - (basicSalary * 0.1);

  const hraExemption = Math.min(
    hraReceived,
    cityBasedExemption,
    rentBasedExemption > 0 ? rentBasedExemption : 0
  );

  const taxableHRA = hraReceived - hraExemption;

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    label: `Month ${i + 1}`,
    value: hraReceived,
  }));

  return {
    hraReceived,
    hraExemption,
    taxableHRA,
    monthlyData,
  };
}

export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  currentSavings: number,
  monthlyInvestment: number,
  expectedReturn: number,
  inflationRate: number = 6
): {
  requiredCorpus: number;
  currentCorpus: number;
  monthlyInvestmentNeeded: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsPostRetirement = 85 - retirementAge; 

  const futureMonthlyExpenses = monthlyExpenses * 
    Math.pow(1 + inflationRate / 100, yearsToRetirement);

  const requiredCorpus = (futureMonthlyExpenses * 12) / 0.04;

  const currentCorpus = currentSavings * 
    Math.pow(1 + expectedReturn / 100, yearsToRetirement);

  const monthlyRate = expectedReturn / 12 / 100;
  const months = yearsToRetirement * 12;

  const futureValueOfCurrentInvestments = monthlyInvestment * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate);

  const totalExpectedCorpus = currentCorpus + futureValueOfCurrentInvestments;

  const shortfall = Math.max(0, requiredCorpus - totalExpectedCorpus);
  const monthlyInvestmentNeeded = shortfall > 0 
    ? (shortfall * monthlyRate) / 
      (Math.pow(1 + monthlyRate, months) - 1) / 
      (1 + monthlyRate)
    : 0;

  const yearlyData = [];
  for (let year = 0; year <= yearsToRetirement; year++) {
    const savingsGrowth = currentSavings * 
      Math.pow(1 + expectedReturn / 100, year);
    const investmentGrowth = monthlyInvestment * 12 * 
      ((Math.pow(1 + expectedReturn / 100, year) - 1) / 
      (expectedReturn / 100));
    yearlyData.push({
      label: `Age ${currentAge + year}`,
      value: Math.round(savingsGrowth + investmentGrowth),
    });
  }

  return {
    requiredCorpus,
    currentCorpus,
    monthlyInvestmentNeeded,
    yearlyData,
  };
}

export function calculateNSC(
  principal: number,
  years: number = 5 // NSC has a fixed 5-year term
): {
  totalInvestment: number;
  totalInterest: number;
  maturityValue: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const interestRate = 6.8 / 100; // Current NSC interest rate
  let balance = principal;
  let totalInterest = 0;
  let yearlyData = [];

  yearlyData.push({
    label: "Year 0",
    value: principal,
  });

  for (let i = 1; i <= years; i++) {
    const interest = balance * interestRate;
    totalInterest += interest;
    balance += interest;
    yearlyData.push({
      label: `Year ${i}`,
      value: Math.round(balance),
    });
  }

  return {
    totalInvestment: principal,
    totalInterest,
    maturityValue: balance,
    yearlyData,
  };
}

export function calculateStepUpSIP(
  initialMonthlyInvestment: number,
  years: number,
  expectedReturn: number,
  annualIncrement: number // Percentage increase per year
): {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  monthlyData: Array<{ label: string; value: number }>;
} {
  const monthlyRate = expectedReturn / 12 / 100;
  const months = years * 12;
  let monthlyInvestment = initialMonthlyInvestment;
  let totalInvestment = 0;
  let balance = 0;
  let monthlyData = [];

  for (let i = 0; i <= months; i++) {
    // Increase investment at the start of each year (except first year)
    if (i > 0 && i % 12 === 0) {
      monthlyInvestment += (monthlyInvestment * annualIncrement) / 100;
    }

    if (i > 0) {
      balance = (balance + monthlyInvestment) * (1 + monthlyRate);
      totalInvestment += monthlyInvestment;
    }

    monthlyData.push({
      label: `Month ${i}`,
      value: Math.round(balance),
    });
  }

  return {
    totalInvestment,
    totalReturns: balance - totalInvestment,
    maturityValue: balance,
    monthlyData,
  };
}

export function calculateIncomeTax(
  salary: number,
  deductions: number = 0
): {
  taxableIncome: number;
  taxAmount: number;
  effectiveTaxRate: number;
  slabwiseBreakup: Array<{
    slab: string;
    tax: number;
  }>;
} {
  // New tax regime slabs (FY 2024-25)
  const slabs = [
    { limit: 300000, rate: 0 },    // 0-3L: 0%
    { limit: 600000, rate: 5 },    // 3-6L: 5%
    { limit: 900000, rate: 10 },   // 6-9L: 10%
    { limit: 1200000, rate: 15 },  // 9-12L: 15%
    { limit: 1500000, rate: 20 },  // 12-15L: 20%
    { limit: Infinity, rate: 30 }, // >15L: 30%
  ];

  const taxableIncome = Math.max(0, salary - deductions);
  let remainingIncome = taxableIncome;
  let totalTax = 0;
  let slabwiseBreakup = [];
  let previousLimit = 0;

  for (const slab of slabs) {
    const slabIncome = Math.min(
      Math.max(0, remainingIncome),
      slab.limit - previousLimit
    );
    const slabTax = (slabIncome * slab.rate) / 100;

    if (slabTax > 0) {
      slabwiseBreakup.push({
        slab: `${previousLimit.toLocaleString()}-${slab.limit === Infinity ? "Above" : slab.limit.toLocaleString()}`,
        tax: slabTax,
      });
    }

    totalTax += slabTax;
    remainingIncome -= slabIncome;
    previousLimit = slab.limit;

    if (remainingIncome <= 0) break;
  }

  return {
    taxableIncome,
    taxAmount: totalTax,
    effectiveTaxRate: (totalTax / taxableIncome) * 100,
    slabwiseBreakup,
  };
}