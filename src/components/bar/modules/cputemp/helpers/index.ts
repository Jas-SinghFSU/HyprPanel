import { Variable } from 'astal';
import GLib from 'gi://GLib?version=2.0';
import { convertCelsiusToFahrenheit } from 'src/globals/weather';
import { UnitType } from 'src/lib/types/weather';
import options from 'src/options';
const { sensor } = options.bar.customModules.cpuTemp;

/**
 * Retrieves the current CPU temperature.
 * @returns CPU temperature in degrees Celsius
 */
export const getCPUTemperature = (round: Variable<boolean>, unit: Variable<UnitType>): number => {
    try {
        if (sensor.value.length === 0) {
            return 0;
        }

        const [success, tempInfoBytes] = GLib.file_get_contents(sensor.value);
        const tempInfo = new TextDecoder('utf-8').decode(tempInfoBytes);

        if (!success || !tempInfoBytes) {
            console.error(`Failed to read ${sensor.value} or file content is null.`);
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