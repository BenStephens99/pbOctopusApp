'use server'
import { getOctopusAccount } from "./octopus"

export async function getProperties (account) {
    
    let properties = []

    for (const octopus of account.octopus) {
        for (const property of octopus.properties) {

            const electricMeterPoint = property?.electricity_meter_points[property.electricity_meter_points.length - 1] || null
            const electricMeters = electricMeterPoint.meters || []
            const electricMeter = electricMeters[electricMeters.length - 1] || null

            const gasMeterPoint = property.gas_meter_points[property.gas_meter_points.length - 1] || null
            const gasMeters = gasMeterPoint.meters || []
            const gasMeter = gasMeters[gasMeters.length - 1] || null

            properties.push(
                {
                    addressLine1: property.address_line_1,
                    postcode: property.postcode,
                    town: property.town,
                    mpan: electricMeterPoint?.mpan || null, 
                    electricSerialNumber: electricMeter?.serial_number || null,
                    mprn: gasMeterPoint?.mprn || null,
                    gasSerialNumber: gasMeter?.serial_number || null,
                }
            )
        }
    }

    return properties;
}