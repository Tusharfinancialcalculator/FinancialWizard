export function calculateSIP(
  monthlyInvestment: number,
  years: number,
  expectedReturn: number
) {
  const monthlyRate = expectedReturn / 12 / 100;
  const months = years * 12;

  let monthlyData: Array<{ label: string; value: number }> = [];
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
) {
  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  let monthlyData: Array<{ label: string; value: number }> = [];
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
) {
  const amount =
    principal * Math.pow(1 + rate / (frequency * 100), frequency * time);
  const interest = amount - principal;

  let yearlyData: Array<{ label: string; value: number }> = [];
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
) {
  const annualRate = expectedReturn / 100;
  const maturityValue = principal * Math.pow(1 + annualRate, years);
  const totalReturns = maturityValue - principal;

  let yearlyData: Array<{ label: string; value: number }> = [];
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
) {
  const interestRate = 7.1 / 100;
  let balance = 0;
  let totalInterest = 0;
  let yearlyData: Array<{ label: string; value: number }> = [];

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
) {
  const ratePerPeriod = rate / (100 * compoundingFrequency);
  const totalPeriods = years * compoundingFrequency;

  const maturityValue = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
  const totalInterest = maturityValue - principal;

  let yearlyData: Array<{ label: string; value: number }> = [];
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
) {
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  let maturityValue = 0;
  let yearlyData: Array<{ label: string; value: number }> = [];

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
) {
  const interest = (principal * rate * time) / 100;
  const amount = principal + interest;

  let yearlyData: Array<{ label: string; value: number }> = [];
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
) {
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

  const monthlyData: Array<{ label: string; value: number }> = Array.from(
    { length: 12 },
    (_, i) => ({
      label: `Month ${i + 1}`,
      value: hraReceived,
    })
  );

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
  inflationRate: number = 6,
  annualExpenseIncrease: number = 0,
  annualInvestmentIncrease: number = 0,
  fireType: "lean" | "mid" | "fat" = "mid"
) {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsPostRetirement = 85 - retirementAge;

  // Calculate future monthly expenses considering both inflation and annual increase
  const futureMonthlyExpenses = monthlyExpenses * 
    Math.pow(1 + (inflationRate + annualExpenseIncrease) / 100, yearsToRetirement);

  // Required corpus calculation based on FIRE type
  // Lean FIRE: 30x annual expenses (3.33% withdrawal rate for more safety)
  // Mid FIRE: 25x annual expenses (4% withdrawal rate - traditional)
  // Fat FIRE: 20x annual expenses (5% withdrawal rate - more aggressive)
  const multiplier = fireType === "lean" ? 30 : fireType === "fat" ? 20 : 25;
  const requiredCorpus = futureMonthlyExpenses * 12 * multiplier;

  // Calculate how current savings will grow by retirement
  const currentCorpus = currentSavings *
    Math.pow(1 + expectedReturn / 100, yearsToRetirement);

  const monthlyRate = expectedReturn / 12 / 100;
  const months = yearsToRetirement * 12;

  // Calculate future value of monthly investments with annual increases
  let futureValueOfInvestments = 0;
  let yearlyInvestment = monthlyInvestment * 12;

  for (let year = 0; year < yearsToRetirement; year++) {
    futureValueOfInvestments = (futureValueOfInvestments + yearlyInvestment) * 
      (1 + expectedReturn / 100);
    yearlyInvestment *= (1 + annualInvestmentIncrease / 100);
  }

  const totalExpectedCorpus = currentCorpus + futureValueOfInvestments;

  const shortfall = Math.max(0, requiredCorpus - totalExpectedCorpus);
  const monthlyInvestmentNeeded = shortfall > 0
    ? (shortfall * monthlyRate) /
      (Math.pow(1 + monthlyRate, months) - 1) /
      (1 + monthlyRate)
    : 0;

  const yearlyData: Array<{ label: string; value: number }> = [];
  let currentBalance = currentSavings;
  yearlyInvestment = monthlyInvestment * 12;

  yearlyData.push({
    label: `Age ${currentAge}`,
    value: currentBalance,
  });

  for (let year = 1; year <= yearsToRetirement; year++) {
    currentBalance = (currentBalance + yearlyInvestment) * (1 + expectedReturn / 100);
    yearlyInvestment *= (1 + annualInvestmentIncrease / 100);

    yearlyData.push({
      label: `Age ${currentAge + year}`,
      value: Math.round(currentBalance),
    });
  }

  return {
    requiredCorpus,
    currentCorpus: totalExpectedCorpus,
    monthlyInvestmentNeeded,
    yearlyData,
    futureMonthlyExpenses,
    shortfall,
    withdrawalRate: (1 / multiplier) * 100,
  };
}

export function calculateNSC(
  principal: number,
  years: number = 5
) {
  const interestRate = 6.8 / 100;
  let balance = principal;
  let totalInterest = 0;
  let yearlyData: Array<{ label: string; value: number }> = [];

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
) {
  const monthlyRate = expectedReturn / 12 / 100;
  const months = years * 12;
  let monthlyInvestment = initialMonthlyInvestment;
  let totalInvestment = 0;
  let balance = 0;
  let monthlyData: Array<{ label: string; value: number }> = [
    {
      label: "Month 0",
      value: 0,
    },
  ];

  for (let i = 1; i <= months; i++) {
    if (i > 12 && i % 12 === 1) {
      monthlyInvestment *= (1 + annualIncrement / 100);
    }

    totalInvestment += monthlyInvestment;

    balance = (balance + monthlyInvestment) * (1 + monthlyRate);

    monthlyData.push({
      label: `Month ${i}`,
      value: Math.round(balance),
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
) {
  const newRegimeSlabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 5 },
    { limit: 900000, rate: 10 },
    { limit: 1200000, rate: 15 },
    { limit: 1500000, rate: 20 },
    { limit: Infinity, rate: 30 },
  ];

  const oldRegimeSlabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 5 },
    { limit: 1000000, rate: 20 },
    { limit: Infinity, rate: 30 },
  ];

  const slabs = regime === "new" ? newRegimeSlabs : oldRegimeSlabs;
  const grossIncome = income;
  const taxableIncome = Math.max(0, income - (regime === "old" ? deductions : 0));
  let remainingIncome = taxableIncome;
  let totalTax = 0;
  let slabwiseBreakup: Array<{
    slab: string;
    tax: number;
  }> = [];
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
        tax: Math.round(slabTax),
      });
    }

    remainingIncome -= slabIncome;
    previousLimit = slab.limit;

    if (remainingIncome <= 0) break;
  }

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
) {
  const cagrPercentage = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;

  const yearlyData: Array<{ label: string; value: number }> = [];
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
) {
  const isEligible = yearsOfService >= 5;

  const dailyWage = basicSalary / 26;

  const fifteenDaysSalary = dailyWage * 15;

  let gratuityAmount = 0;
  if (isEligible) {
    gratuityAmount = fifteenDaysSalary * yearsOfService;
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
) {
  if (currentAge < 18 || currentAge > 40) {
    throw new Error("Age must be between 18 and 40 years");
  }

  const pensionSlabs = [1000, 2000, 3000, 4000, 5000];

  const nearestSlab = pensionSlabs.reduce((prev, curr) =>
    Math.abs(curr - desiredPension) < Math.abs(prev - desiredPension) ? curr : prev
  );

  const baseContributionChart: Record<number, number> = {
    18: 42, 19: 46, 20: 50, 21: 54, 22: 59, 23: 64, 24: 70, 25: 76,
    26: 82, 27: 89, 28: 97, 29: 106, 30: 115, 31: 125, 32: 137, 33: 149,
    34: 162, 35: 177, 36: 192, 37: 210, 38: 230, 39: 251, 40: 274,
  };

  const monthlyContribution = Math.round(baseContributionChart[currentAge] * (nearestSlab / 1000));

  const yearsTillMaturity = 60 - currentAge;

  const totalInvestment = monthlyContribution * 12 * yearsTillMaturity;

  const corpusAtMaturity = nearestSlab * 12 * 170;

  let yearlyData: Array<{ label: string; value: number }> = [];
  const assumedReturnRate = 0.08;
  let currentCorpus = 0;

  for (let i = 0; i <= yearsTillMaturity; i++) {
    currentCorpus = (currentCorpus + monthlyContribution * 12) * (1 + assumedReturnRate);
    yearlyData.push({
      label: `Age ${currentAge + i}`,
      value: Math.round(currentCorpus),
    });
  }

  return {
    monthlyContribution,
    totalInvestment,
    corpusAtMaturity,
    monthlyPension: nearestSlab,
    yearlyData,
  };
}

export function calculateGST(
  amount: number,
  gstRate: number,
  isInclusive: boolean = false
) {
  const cgstRate = gstRate / 2;
  const sgstRate = gstRate / 2;

  let baseAmount: number;
  let totalAmount: number;

  if (isInclusive) {
    baseAmount = (amount * 100) / (100 + gstRate);
    totalAmount = amount;
  } else {
    baseAmount = amount;
    totalAmount = amount * (1 + gstRate / 100);
  }

  const cgst = (baseAmount * cgstRate) / 100;
  const sgst = (baseAmount * sgstRate) / 100;
  const totalGST = cgst + sgst;

  return {
    baseAmount: Math.round(baseAmount),
    cgst: Math.round(cgst),
    sgst: Math.round(sgst),
    totalGST: Math.round(totalGST),
    totalAmount: Math.round(totalAmount),
    breakdown: {
      cgstRate,
      sgstRate,
    },
  };
}

export function calculateFlatVsReducingRate(
  principal: number,
  tenure: number,
  flatRate: number,
  reducingRate: number
) {
  const flatMonthlyRate = flatRate / 12 / 100;
  const months = tenure * 12;

  const flatEMI = (principal + (principal * flatRate * tenure / 100)) / months;
  const flatTotalPayment = flatEMI * months;
  const flatTotalInterest = flatTotalPayment - principal;

  let flatMonthlyData: Array<{ label: string; value: number }> = [];
  let flatRemainingBalance = principal;
  const flatMonthlyPrincipal = principal / months;

  for (let i = 0; i <= months; i++) {
    flatMonthlyData.push({
      label: `Month ${i}`,
      value: Math.round(flatRemainingBalance),
    });
    flatRemainingBalance -= flatMonthlyPrincipal;
  }

  const reducingMonthlyRate = reducingRate / 12 / 100;

  const reducingEMI = (principal * reducingMonthlyRate * Math.pow(1 + reducingMonthlyRate, months)) /
    (Math.pow(1 + reducingMonthlyRate, months) - 1);

  const reducingTotalPayment = reducingEMI * months;
  const reducingTotalInterest = reducingTotalPayment - principal;

  let reducingMonthlyData: Array<{ label: string; value: number }> = [];
  let reducingRemainingBalance = principal;

  for (let i = 0; i <= months; i++) {
    reducingMonthlyData.push({
      label: `Month ${i}`,
      value: Math.round(reducingRemainingBalance),
    });
    const interestPayment = reducingRemainingBalance * reducingMonthlyRate;
    const principalPayment = reducingEMI - interestPayment;
    reducingRemainingBalance -= principalPayment;
  }

  const interestSaved = flatTotalInterest - reducingTotalInterest;
  const effectiveRateDiff = (flatTotalInterest - reducingTotalInterest) / (principal * tenure) * 100;

  return {
    flatInterest: {
      emi: Math.round(flatEMI),
      totalInterest: Math.round(flatTotalInterest),
      totalPayment: Math.round(flatTotalPayment),
      monthlyData: flatMonthlyData,
    },
    reducingInterest: {
      emi: Math.round(reducingEMI),
      totalInterest: Math.round(reducingTotalInterest),
      totalPayment: Math.round(reducingTotalPayment),
      monthlyData: reducingMonthlyData,
    },
    comparison: {
      interestSaved: Math.round(interestSaved),
      effectiveRateDiff: Number(effectiveRateDiff.toFixed(2)),
    },
  };
}

export function calculateBrokerage(
  type: "delivery" | "intraday" | "futures" | "options",
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  strikePrice?: number
) {
  const buyValue = buyPrice * quantity;
  const sellValue = sellPrice * quantity;
  const totalTurnover = buyValue + sellValue;

  let brokerage = 0;
  if (type === "delivery") {
    brokerage = Math.min(totalTurnover * 0.0003, 20);
  } else if (type === "intraday" || type === "futures") {
    brokerage = Math.min(totalTurnover * 0.0002, 20);
  } else {
    brokerage = Math.min(40, totalTurnover * 0.0002);
  }

  let stt = 0;
  if (type === "delivery") {
    stt = (buyValue + sellValue) * 0.001;
  } else if (type === "intraday") {
    stt = sellValue * 0.00025;
  } else if (type === "futures") {
    stt = sellValue * 0.0001;
  } else {
    stt = sellValue * 0.0005;
  }

  const exchangeCharges = totalTurnover * 0.0000345;

  const gst = (brokerage + exchangeCharges) * 0.18;

  const sebi = totalTurnover * 0.000001;

  let stampDuty = 0;
  if (type === "delivery") {
    stampDuty = buyValue * 0.00015;
  } else if (type === "intraday" || type === "futures") {
    stampDuty = buyValue * 0.00003;
  } else {
    stampDuty = buyValue * 0.00003;
  }

  const totalCharges = brokerage + stt + exchangeCharges + gst + sebi + stampDuty;

  const netProfitLoss = sellValue - buyValue - totalCharges;

  const chargesPerUnit = totalCharges / quantity;
  const breakEvenPriceUp = buyPrice + chargesPerUnit;
  const breakEvenPriceDown = sellPrice - chargesPerUnit;

  return {
    buyValue: Math.round(buyValue * 100) / 100,
    sellValue: Math.round(sellValue * 100) / 100,
    totalTurnover: Math.round(totalTurnover * 100) / 100,
    brokerage: Math.round(brokerage * 100) / 100,
    stt: Math.round(stt * 100) / 100,
    exchangeCharges: Math.round(exchangeCharges * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    sebi: Math.round(sebi * 100) / 100,
    stampDuty: Math.round(stampDuty * 100) / 100,
    totalCharges: Math.round(totalCharges * 100) / 100,
    netProfitLoss: Math.round(netProfitLoss * 100) / 100,
    breakEvenPriceUp: Math.round(breakEvenPriceUp * 100) / 100,
    breakEvenPriceDown: Math.round(breakEvenPriceDown * 100) / 100,
  };
}

export function calculateMargin(
  type: "equity" | "futures" | "options",
  price: number,
  quantity: number,
  lotSize: number = 1,
  volatility: number = 15
) {
  const totalValue = price * quantity * lotSize;

  // VAR (Value at Risk) Margin - based on volatility
  const varMargin = totalValue * (volatility / 100);

  // Exposure Margin
  let exposureMargin = 0;
  if (type === "equity") {
    exposureMargin = totalValue * 0.20; // 20% for equity delivery
  } else if (type === "futures") {
    exposureMargin = totalValue * 0.25; // 25% for futures
  } else {
    exposureMargin = totalValue * 0.15; // 15% for options
  }

  // SPAN Margin (simplified calculation)
  let spanMargin = 0;
  if (type === "futures" || type === "options") {
    spanMargin = totalValue * (volatility / 100) * 1.5; // 1.5x of VAR for derivatives
  }

  const totalMargin = varMargin + exposureMargin + spanMargin;
  const marginPercentage = (totalMargin / totalValue) * 100;

  return {
    totalValue: Math.round(totalValue * 100) / 100,
    varMargin: Math.round(varMargin * 100) / 100,
    exposureMargin: Math.round(exposureMargin * 100) / 100,
    spanMargin: Math.round(spanMargin * 100) / 100,
    totalMargin: Math.round(totalMargin * 100) / 100,
    marginPercentage: Math.round(marginPercentage * 100) / 100,
  };
}

export interface TDSCalculationResult {
  grossAmount: number;
  tdsAmount: number;
  netAmount: number;
  tdsRate: number;
  tdsThreshold: number;
  isTDSApplicable: boolean;
}

export function calculateTDS(
  amount: number,
  paymentType: "salary" | "professional_fees" | "rent" | "commission" | "interest" | "contractor",
  isNonResident: boolean = false
): TDSCalculationResult {
  // TDS rates and thresholds for different payment types
  const tdsRates = {
    salary: { resident: 0.10, nonResident: 0.20, threshold: 50000 },
    professional_fees: { resident: 0.10, nonResident: 0.20, threshold: 30000 },
    rent: { resident: 0.10, nonResident: 0.30, threshold: 20000 },
    commission: { resident: 0.05, nonResident: 0.20, threshold: 15000 },
    interest: { resident: 0.10, nonResident: 0.20, threshold: 40000 },
    contractor: { resident: 0.02, nonResident: 0.20, threshold: 30000 },
  };

  const rateInfo = tdsRates[paymentType];
  const tdsRate = isNonResident ? rateInfo.nonResident : rateInfo.resident;
  const threshold = rateInfo.threshold;
  const isTDSApplicable = amount >= threshold;

  const tdsAmount = isTDSApplicable ? amount * tdsRate : 0;
  const netAmount = amount - tdsAmount;

  return {
    grossAmount: Math.round(amount * 100) / 100,
    tdsAmount: Math.round(tdsAmount * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
    tdsRate: tdsRate * 100,
    tdsThreshold: threshold,
    isTDSApplicable,
  };
}

export interface SalaryCalculationResult {
  basicSalary: number;
  grossSalary: number;
  deductions: {
    providentFund: number;
    professionalTax: number;
    incomeTax: number;
  };
  netSalary: number;
  monthlyBreakdown: {
    hra: number;
    basicAllowance: number;
    specialAllowance: number;
    conveyanceAllowance: number;
    medicalAllowance: number;
    otherAllowances: number;
  };
}

export function calculateSalary(
  basicSalary: number,
  hra: number = 0,
  basicAllowance: number = 0,
  specialAllowance: number = 0,
  conveyanceAllowance: number = 0,
  medicalAllowance: number = 0,
  otherAllowances: number = 0,
  extraDeductions: number = 0
): SalaryCalculationResult {
  // Calculate monthly allowances
  const monthlyBreakdown = {
    hra,
    basicAllowance,
    specialAllowance,
    conveyanceAllowance,
    medicalAllowance,
    otherAllowances,
  };

  // Calculate gross salary
  const grossSalary = basicSalary +
    Object.values(monthlyBreakdown).reduce((sum, value) => sum + value, 0);

  // Calculate standard deductions
  const providentFund = Math.min(basicSalary * 0.12, 1800); // 12% of basic, capped at 1800
  const professionalTax = grossSalary > 15000 ? 200 : 0; // PT varies by state, using common slab

  // Simplified income tax calculation (actual calculation should use tax slabs)
  const annualGrossSalary = grossSalary * 12;
  const incomeTax = annualGrossSalary > 500000 ? 
    (grossSalary * 0.1) : 0; // Simplified 10% tax above 5L annually

  // Calculate total deductions
  const deductions = {
    providentFund,
    professionalTax,
    incomeTax,
  };

  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0) + extraDeductions;

  // Calculate net salary
  const netSalary = grossSalary - totalDeductions;

  return {
    basicSalary,
    grossSalary,
    deductions,
    netSalary,
    monthlyBreakdown,
  };
}