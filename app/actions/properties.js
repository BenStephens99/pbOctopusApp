'use server';
import { getOctopusAccount } from './octopus';

export async function getProperties(account) {
  let properties = [];

  if (account.octopus?.length) {
    for (const octopus of account.octopus) {
      if (octopus.properties?.length) {
        for (const property of octopus.properties) {
          const electricMeterPoint =
            property?.electricity_meter_points[property.electricity_meter_points.length - 1] ||
            null;
          const electricMeters = electricMeterPoint.meters || [];

          const gasMeterPoint =
            property.gas_meter_points[property.gas_meter_points.length - 1] || null;
          const gasMeters = gasMeterPoint?.meters || [];

          properties.push({
            accountNumber: octopus.account_number,
            addressLine1: property.address_line_1,
            postcode: property.postcode,
            town: property.town,
            mpan: electricMeterPoint?.mpan || null,
            electricSerialNumbers: electricMeters.map((meter) => meter.serial_number),
            mprn: gasMeterPoint?.mprn || null,
            gasSerialNumbers: gasMeters.map((meter) => meter.serial_number),
          });
        }
      }
    }
  }

  properties.sort((a, b) => {
    if (a.addressLine1 < b.addressLine1) {
      return -1;
    }
    if (a.addressLine1 > b.addressLine1) {
      return 1;
    }
    return 0;
  });

  return properties;
}
