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