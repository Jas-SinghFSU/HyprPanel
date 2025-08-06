import { bind, Binding } from 'astal';
import CpuTempService from 'src/services/system/cputemp';
import { TemperatureConverter } from 'src/lib/units/temperature';
import { CpuTempSensorDiscovery } from 'src/services/system/cputemp/sensorDiscovery';
import options from 'src/configuration';
import GLib from 'gi://GLib?version=2.0';

const { pollingInterval, sensor } = options.bar.customModules.cpuTemp;

/**
 * Creates a tooltip for the CPU temperature module showing sensor details
 */
export function getCpuTempTooltip(cpuTempService: CpuTempService): Binding<string> {
    return bind(cpuTempService.temperature).as((temp) => {
        const currentPath = cpuTempService.currentSensorPath;
        const configuredSensor = sensor.get();
        const isAuto = configuredSensor === 'auto' || configuredSensor === '';

        const tempC = TemperatureConverter.fromCelsius(temp).formatCelsius();
        const tempF = TemperatureConverter.fromCelsius(temp).formatFahrenheit();

        const lines = [
            'CPU Temperature',
            '─────────────────────────',
            `Current: ${tempC} (${tempF})`,
            '',
            'Sensor Information',
            '─────────────────────────',
        ];

        if (currentPath) {
            const sensorType = getSensorType(currentPath);
            const sensorName = getSensorName(currentPath);
            const chipName = getChipName(currentPath);

            lines.push(`Mode: ${isAuto ? 'Auto-discovered' : 'User-configured'}`, `Type: ${sensorType}`);

            if (chipName) {
                lines.push(`Chip: ${chipName}`);
            }

            lines.push(`Device: ${sensorName}`, `Path: ${currentPath}`);
        } else {
            lines.push('Status: No sensor found', 'Try setting a manual sensor path');
        }

        const interval = pollingInterval.get();
        lines.push('', `Update interval: ${interval}ms`);

        const allSensors = CpuTempSensorDiscovery.getAllSensors();
        if (allSensors.length > 1) {
            lines.push('', `Available sensors: ${allSensors.length}`);
        }

        return lines.join('\n');
    });
}

/**
 * Determines sensor type from path
 */
function getSensorType(path: string): string {
    if (path.includes('/sys/class/hwmon/')) return 'Hardware Monitor';
    if (path.includes('/sys/class/thermal/')) return 'Thermal Zone';
    return 'Unknown';
}

/**
 * Extracts sensor name from path
 */
function getSensorName(path: string): string {
    if (path.includes('/sys/class/hwmon/')) {
        const match = path.match(/hwmon(\d+)/);
        return match ? `hwmon${match[1]}` : 'Unknown';
    }

    if (path.includes('/sys/class/thermal/')) {
        const match = path.match(/thermal_zone(\d+)/);
        return match ? `thermal_zone${match[1]}` : 'Unknown';
    }

    return 'Unknown';
}

/**
 * Gets the actual chip name for hwmon sensors
 */
function getChipName(path: string): string | undefined {
    if (!path.includes('/sys/class/hwmon/')) return undefined;

    try {
        const match = path.match(/\/sys\/class\/hwmon\/hwmon\d+/);
        if (!match) return undefined;

        const nameFile = `${match[0]}/name`;
        const [success, bytes] = GLib.file_get_contents(nameFile);

        if (success && bytes) {
            return new TextDecoder('utf-8').decode(bytes).trim();
        }
    } catch (error) {
        if (error instanceof Error) {
            console.debug(`Failed to get chip name: ${error.message}`);
        }
    }

    return undefined;
}
