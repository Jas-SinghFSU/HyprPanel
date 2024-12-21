import { Variable } from 'astal';
import GLib from 'gi://GLib?version=2.0';
import { convertCelsiusToFahrenheit } from 'src/globals/weather';
import { UnitType } from 'src/lib/types/weather';
import options from 'src/options';
const { sensor } = options.bar.customModules.cpuTemp;

/**
 * Retrieves the current CPU temperature.
 *
 * This function reads the CPU temperature from the specified sensor file and converts it to the desired unit (Celsius or Fahrenheit).
 * It also handles rounding the temperature value based on the provided `round` variable.
 *
 * @param round A Variable<boolean> indicating whether to round the temperature value.
 * @param unit A Variable<UnitType> indicating the desired unit for the temperature (Celsius or Fahrenheit).
 *
 * @returns The current CPU temperature as a number. Returns 0 if an error occurs or the sensor file is empty.
 */
export const getCPUTemperature = (round: Variable<boolean>, unit: Variable<UnitType>): number => {
    try {
        if (sensor.get().length === 0) {
            return 0;
        }

        const [success, tempInfoBytes] = GLib.file_get_contents(sensor.get());
        const tempInfo = new TextDecoder('utf-8').decode(tempInfoBytes);

        if (!success || !tempInfoBytes) {
            console.error(`Failed to read ${sensor.get()} or file content is null.`);
            return 0;
        }

        let decimalTemp = parseInt(tempInfo, 10) / 1000;

        if (unit.get() === 'imperial') {
            decimalTemp = convertCelsiusToFahrenheit(decimalTemp);
        }

        return round.get() ? Math.round(decimalTemp) : parseFloat(decimalTemp.toFixed(2));
    } catch (error) {
        console.error('Error calculating CPU Temp:', error);
        return 0;
    }
};
