'use client'

export function calculateElectric (usage, standingCharges, unitRates) {
    let totalCost = 0;

    for (const usageData of usage) {
        const consumption = usageData.consumption;
        const intervalStart = new Date(usageData.interval_start).toISOString();

        const standingCharge = getStandingCharge(standingCharges, intervalStart);

        const unitRate = getUnitRate(unitRates, intervalStart);

        const dailyCost = (consumption * unitRate) + standingCharge;

        totalCost += dailyCost;
    }

    totalCost = (totalCost / 100).toFixed(2);

    return totalCost;
}

export function calculateGas (usage, standingCharges, unitRates) {
    let totalCost = 0;

    for (const usageData of usage) {
        const consumption = usageData.consumption;
        const intervalStart = new Date(usageData.interval_start).toISOString();

        const standingCharge = getStandingCharge(standingCharges, intervalStart);

        const unitRate = getUnitRate(unitRates, intervalStart);

        const dailyCost = (consumption * unitRate) + standingCharge;

        totalCost += dailyCost;
    }

    totalCost = (totalCost / 100).toFixed(2);

    return totalCost;
}

function getStandingCharge(standingCharges, date) {
    for (const charge of standingCharges) {
        const validFrom = new Date(charge.valid_from).toISOString();
        let validTo = null

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

function getUnitRate(unitRates, date) {
    for (const rate of unitRates) {
        const validFrom = new Date(rate.valid_from).toISOString();
        let validTo = null

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