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
  cityType: "metro" | "non-metro"
): {
  hraReceived: number;
  hraExemption: number;
  taxableHRA: number;
  monthlyData: Array<{ label: string; value: number }>;
} {
  const hraReceived = basicSalary * 0.4;
  const cityMultiplier = cityType === "metro" ? 0.5 : 0.4;
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
  annualIncrement: number
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
  let monthlyData = [{
    label: "Month 0",
    value: 0
  }];

  for (let i = 1; i <= months; i++) {
    // Increase investment at the start of each year (after first year)
    if (i > 12 && i % 12 === 1) {
      monthlyInvestment *= (1 + annualIncrement / 100);
    }

    // Add this month's investment
    totalInvestment += monthlyInvestment;

    // Calculate returns including this month's investment
    balance = (balance + monthlyInvestment) * (1 + monthlyRate);

    monthlyData.push({
      label: `Month ${i}`,
      value: Math.round(balance)
    });
  }

  const totalReturns = balance - totalInvestment;

  return {
    totalInvestment: Math.round(totalInvestment),
    totalReturns: Math.round(totalReturns),
    maturityValue: Math.round(balance),
    monthlyData,
  };
}

export function calculateIncomeTax(
  income: number,
  deductions: number = 0,
  regime: "old" | "new" = "new"
): {
  taxableIncome: number;
  taxAmount: number;
  effectiveTaxRate: number;
  slabwiseBreakup: Array<{
    slab: string;
    tax: number;
  }>;
  grossIncome: number;
  takeHome: number;
} {
  // Tax regime slabs (FY 2024-25)
  const newRegimeSlabs = [
    { limit: 300000, rate: 0 },    // 0-3L: 0%
    { limit: 600000, rate: 5 },    // 3-6L: 5%
    { limit: 900000, rate: 10 },   // 6-9L: 10%
    { limit: 1200000, rate: 15 },  // 9-12L: 15%
    { limit: 1500000, rate: 20 },  // 12-15L: 20%
    { limit: Infinity, rate: 30 }, // >15L: 30%
  ];

  const oldRegimeSlabs = [
    { limit: 250000, rate: 0 },    // 0-2.5L: 0%
    { limit: 500000, rate: 5 },    // 2.5-5L: 5%
    { limit: 1000000, rate: 20 },  // 5-10L: 20%
    { limit: Infinity, rate: 30 }, // >10L: 30%
  ];

  const slabs = regime === "new" ? newRegimeSlabs : oldRegimeSlabs;
  const grossIncome = income;
  const taxableIncome = Math.max(0, income - (regime === "old" ? deductions : 0));
  let remainingIncome = taxableIncome;
  let totalTax = 0;
  let slabwiseBreakup = [];
  let previousLimit = 0;

  for (const slab of slabs) {
    const slabIncome = Math.min(
      Math.max(0, remainingIncome),
      slab.limit - previousLimit
    );

    if (slabIncome > 0) {
      const slabTax = (slabIncome * slab.rate) / 100;
      totalTax += slabTax;

      slabwiseBreakup.push({
        slab: `₹${previousLimit.toLocaleString()}-${slab.limit === Infinity ? "Above" : "₹" + slab.limit.toLocaleString()}`,
        tax: Math.round(slabTax)
      });
    }

    remainingIncome -= slabIncome;
    previousLimit = slab.limit;

    if (remainingIncome <= 0) break;
  }

  // Calculate surcharge and cess if applicable
  let taxAmount = Math.round(totalTax);
  const effectiveTaxRate = Number((totalTax / (taxableIncome || 1) * 100).toFixed(2));
  const takeHome = grossIncome - taxAmount;

  return {
    grossIncome,
    taxableIncome,
    taxAmount,
    effectiveTaxRate,
    slabwiseBreakup,
    takeHome,
  };
}

export function calculateCAGR(
  initialValue: number,
  finalValue: number,
  years: number
): {
  cagrPercentage: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  const cagrPercentage = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;

  // Generate yearly data points for the graph
  const yearlyData = [];
  for (let i = 0; i <= years; i++) {
    const value = initialValue * Math.pow(1 + cagrPercentage / 100, i);
    yearlyData.push({
      label: `Year ${i}`,
      value: Math.round(value),
    });
  }

  return {
    cagrPercentage: Number(cagrPercentage.toFixed(2)),
    yearlyData,
  };
}

export function calculateGratuity(
  basicSalary: number,
  yearsOfService: number
): {
  gratuityAmount: number;
  isEligible: boolean;
  calculationBreakdown: {
    dailyWage: number;
    fifteenDaysSalary: number;
    yearsConsidered: number;
  };
} {
  // Check eligibility (minimum 5 years of service)
  const isEligible = yearsOfService >= 5;

  // Calculate daily wage (basic salary / 26)
  const dailyWage = basicSalary / 26;

  // 15 days salary
  const fifteenDaysSalary = dailyWage * 15;

  // Calculate gratuity amount
  let gratuityAmount = 0;
  if (isEligible) {
    gratuityAmount = fifteenDaysSalary * yearsOfService;

    // Cap maximum gratuity at ₹20 lakhs as per current rules
    gratuityAmount = Math.min(gratuityAmount, 2000000);
  }

  return {
    gratuityAmount: Math.round(gratuityAmount),
    isEligible,
    calculationBreakdown: {
      dailyWage: Math.round(dailyWage),
      fifteenDaysSalary: Math.round(fifteenDaysSalary),
      yearsConsidered: yearsOfService,
    },
  };
}

export function calculateAPY(
  currentAge: number,
  desiredPension: number
): {
  monthlyContribution: number;
  totalInvestment: number;
  corpusAtMaturity: number;
  monthlyPension: number;
  yearlyData: Array<{ label: string; value: number }>;
} {
  // Validate age (18-40 years)
  if (currentAge < 18 || currentAge > 40) {
    throw new Error("Age must be between 18 and 40 years");
  }

  // APY pension slabs (monthly)
  const pensionSlabs = [1000, 2000, 3000, 4000, 5000];

  // Find nearest pension slab
  const nearestSlab = pensionSlabs.reduce((prev, curr) =>
    Math.abs(curr - desiredPension) < Math.abs(prev - desiredPension) ? curr : prev
  );

  // Contribution chart (age -> monthly contribution for ₹1000 pension)
  const baseContributionChart: Record<number, number> = {
    18: 42, 19: 46, 20: 50, 21: 54, 22: 59, 23: 64, 24: 70, 25: 76,
    26: 82, 27: 89, 28: 97, 29: 106, 30: 115, 31: 125, 32: 137, 33: 149,
    34: 162, 35: 177, 36: 192, 37: 210, 38: 230, 39: 251, 40: 274
  };

  // Calculate monthly contribution based on desired pension
  const monthlyContribution = Math.round(baseContributionChart[currentAge] * (nearestSlab / 1000));

  // Calculate years till 60
  const yearsTillMaturity = 60 - currentAge;

  // Calculate total investment
  const totalInvestment = monthlyContribution * 12 * yearsTillMaturity;

  // Corpus at maturity (approximate - 170 times annual pension)
  const corpusAtMaturity = nearestSlab * 12 * 170;

  // Generate yearly data for visualization
  let yearlyData = [];
  const assumedReturnRate = 0.08; // 8% assumed return for projection
  let currentCorpus = 0;

  for (let i = 0; i <= yearsTillMaturity; i++) {
    currentCorpus = (currentCorpus + monthlyContribution * 12) * (1 + assumedReturnRate);
    yearlyData.push({
      label: `Age ${currentAge + i}`,
      value: Math.round(currentCorpus)
    });
  }

  return {
    monthlyContribution,
    totalInvestment,
    corpusAtMaturity,
    monthlyPension: nearestSlab,
    yearlyData
  };
}