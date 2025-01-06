'use client';

export function calculateElectric(usage, standingCharges, unitRates, period = 'day') {
  let totalCost = 0;

  for (const usageData of usage) {
    const consumption = usageData.consumption;
    const intervalStart = new Date(usageData.interval_start).toISOString();

    let standingCharge = getStandingCharge(standingCharges, intervalStart);

    if (period === 'month') {
      const date = new Date(intervalStart);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      standingCharge = standingCharge * (end.getDate() - date.getDate() + 1);
    }

    const unitRate = getUnitRate(unitRates, intervalStart);

    const dailyCost = consumption * unitRate + standingCharge;

    totalCost += dailyCost;
  }

  totalCost = (totalCost / 100).toFixed(2);

  return totalCost;
}

export function calculateGas(usage, standingCharges, unitRates, period = 'day') {
  let totalCost = 0;

  for (const usageData of usage) {
    const consumption = usageData.consumption;
    const intervalStart = new Date(usageData.interval_start).toISOString();

    let standingCharge = getStandingCharge(standingCharges, intervalStart);

    if (period === 'month') {
      const date = new Date(intervalStart);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      standingCharge = standingCharge * (end.getDate() - date.getDate() + 1);
    }

    const unitRate = getUnitRate(unitRates, intervalStart);

    const dailyCost = consumption * unitRate + standingCharge;

    totalCost += dailyCost;
  }

  totalCost = (totalCost / 100).toFixed(2);

  return totalCost;
}

export function getStandingCharge(standingCharges, date) {
  for (const charge of standingCharges) {
    const validFrom = new Date(charge.valid_from).toISOString();
    let validTo = null;

    if (charge.valid_to) {
      validTo = new Date(charge.valid_to).toDateString();
    } else {
      validTo = new Date().toISOString();
    }

    if (validFrom <= date && date <= validTo) {
      return charge.value_inc_vat;
    }
  }
}

export function getUnitRate(unitRates, date) {
  for (const rate of unitRates) {
    const validFrom = new Date(rate.valid_from).toISOString();
    let validTo = null;

    if (rate.valid_to) {
      validTo = new Date(rate.valid_to).toISOString();
    } else {
      validTo = new Date().toISOString();
    }

    if (validFrom <= date && date <= validTo) {
      return rate.value_inc_vat;
    }
  }
}

export function add(a, b) {
  return (parseFloat(a) + parseFloat(b)).toFixed(2);
}
