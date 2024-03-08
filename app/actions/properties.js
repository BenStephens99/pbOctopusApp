'use server'
import { getOctopusAccounts } from "./octopus"
import { getElectricUsage } from "./octopus"
import { getElectricUnitRates } from "./octopus"
import { getElectricStandingCharges } from "./octopus"
import { getGasUsage } from "./octopus"
import { getGasUnitRates } from "./octopus"
import { getGasStandingCharges } from "./octopus"

export async function getPropertiesPage() {
    const octopusAccounts = await getOctopusAccounts();
    
    const lastMonth28 = new Date(new Date().getFullYear(), new Date().getMonth() -1, 28).toISOString().slice(0, 16) + 'Z';

    const currentDate = new Date().toISOString().slice(0, 10) + 'T00:00Z';

    const data = [];

    for (const octopusAccount of octopusAccounts) {
        const account = {
            name: octopusAccount.name,
            account_number: octopusAccount.number,
            properties: [],
        };

        const fetchedUnitRates = {};
        const fetchedStandingCharges = {};

        for (const propertyInfo of octopusAccount.properties) {
            const property = {
                name: propertyInfo.address_line_1,
                electric: {},
                gas: {},
            };

            const electricMeter = propertyInfo.electricity_meter_points[0].meters[0];
            property.electric.mpan = propertyInfo.electricity_meter_points[0].mpan;
            property.electric.serial_number = electricMeter.serial_number;
            property.electric.tariff_code = propertyInfo.electricity_meter_points[0].agreements[0].tariff_code;

            property.electric.usage = await getElectricUsage(octopusAccount.key, property.electric.mpan, property.electric.serial_number, lastMonth28, currentDate);

            property.electric.unit_rates = await fetchOrGetCachedData(fetchedUnitRates, `${octopusAccount.product_code}_${property.electric.tariff_code}`,
                () => getElectricUnitRates(octopusAccount.product_code, property.electric.tariff_code, lastMonth28, currentDate));

            property.electric.standing_charges = await fetchOrGetCachedData(fetchedStandingCharges, `${octopusAccount.product_code}_${property.electric.tariff_code}`,
                () => getElectricStandingCharges(octopusAccount.product_code, property.electric.tariff_code, lastMonth28, currentDate));

            property.electric.cost = calculateCost({
                usage: property.electric.usage,
                standing_charges: property.electric.standing_charges,
                unit_rates: property.electric.unit_rates,
            });

            delete property.electric.usage;
            delete property.electric.unit_rates;
            delete property.electric.standing_charges;

            const gasMeter = propertyInfo.gas_meter_points[0].meters[0];
            property.gas.mprn = propertyInfo.gas_meter_points[0].mprn;
            property.gas.serial_number = gasMeter.serial_number;
            property.gas.tariff_code = propertyInfo.gas_meter_points[0].agreements[0].tariff_code;

            property.gas.usage = await getGasUsage(octopusAccount.key, property.gas.mprn, property.gas.serial_number, lastMonth28, currentDate);

            property.gas.unit_rates = await fetchOrGetCachedData(fetchedUnitRates, `${octopusAccount.product_code}_${property.gas.tariff_code}`,
                () => getGasUnitRates(octopusAccount.product_code, property.gas.tariff_code, lastMonth28, currentDate));

            property.gas.standing_charges = await fetchOrGetCachedData(fetchedStandingCharges, `${octopusAccount.product_code}_${property.gas.tariff_code}`,
                () => getGasStandingCharges(octopusAccount.product_code, property.gas.tariff_code, lastMonth28, currentDate));

            property.gas.cost = calculateCost({
                usage: property.gas.usage,
                standing_charges: property.gas.standing_charges,
                unit_rates: property.gas.unit_rates,
            });

            delete property.gas.usage;
            delete property.gas.unit_rates;
            delete property.gas.standing_charges;

            account.properties.push(property);
        }

        data.push(account);
    }

    return data;
}

// Helper function to fetch or get cached data
async function fetchOrGetCachedData(cache, key, fetchData) {
    if (cache[key]) {
        return cache[key];
    } else {
        const data = await fetchData();
        cache[key] = data;
        return data;
    }
}


function calculateCost(response) {
    let totalCost = 0;

    for (const usageData of response.usage) {
        const consumption = usageData.consumption;
        const roundedConsumption = unbiasedRound(consumption, 3); 
        const intervalStart = new Date(usageData.interval_start);

        const standingCharge = getStandingCharge(response.standing_charges, intervalStart);

        const unitRate = getUnitRate(response.unit_rates, intervalStart);

        const dailyCost = (roundedConsumption * unitRate) + standingCharge;

        totalCost += dailyCost;
    }

    return (totalCost / 100 * 1.05).toFixed(2);
}

// Custom unbiased rounding function
function unbiasedRound(value, decimalPlaces) {
    const factor = 10 ** decimalPlaces;
    const roundedValue = Math.round(value * factor);
    const remainder = roundedValue % 2;

    return (roundedValue - remainder) / factor;
}

function getStandingCharge(standingCharges, date) {
    for (const charge of standingCharges) {
        const validFrom = new Date(charge.valid_from);
        const validTo = new Date(charge.valid_to);

        if (validFrom <= date && date <= validTo) {
            return charge.value_exc_vat;
        }
    }
}

function getUnitRate(unitRates, date) {
    for (const rate of unitRates) {
        const validFrom = new Date(rate.valid_from);
        const validTo = new Date(rate.valid_to);

        if (validFrom <= date && date <= validTo) {
            return rate.value_exc_vat;
        }
    }
}
