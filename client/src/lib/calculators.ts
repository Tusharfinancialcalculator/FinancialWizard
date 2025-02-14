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
