import { CpuTempSensorDiscovery } from 'src/services/system/cputemp/sensorDiscovery';
import CpuTempService from 'src/services/system/cputemp';

/**
 * Lists all available CPU temperature sensors and shows which one is currently active
 */
export function listCpuTempSensors(): string {
    const sensors = CpuTempSensorDiscovery.getAllSensors();
    const cpuTempService = new CpuTempService();
    cpuTempService.initialize();

    const currentSensor = cpuTempService.currentSensorPath;

    let outputMessage = '';
    outputMessage += 'Available CPU Temperature Sensors:\n';
    outputMessage += '==================================\n';

    if (sensors.length === 0) {
        outputMessage += 'No temperature sensors found on the system.\n';
        return outputMessage;
    }

    for (const sensor of sensors) {
        const isCurrent = sensor.path === currentSensor;
        const marker = isCurrent ? ' [CURRENT]' : '';
        outputMessage += `${sensor.type.padEnd(8)} | ${sensor.name.padEnd(20)} | ${sensor.path}${marker}\n`;
    }

    outputMessage += `Auto-discovered sensor: ${CpuTempSensorDiscovery.discover() || 'None'}\n`;

    cpuTempService.destroy();

    return outputMessage;
}
