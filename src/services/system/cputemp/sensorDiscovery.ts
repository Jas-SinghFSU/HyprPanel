import GLib from 'gi://GLib?version=2.0';
import { SensorInfo } from './types';

export class CpuTempSensorDiscovery {
    private static readonly _PRIORITY_SENSORS = [
        /** Intel */
        'coretemp',
        /** AMD Ryzen */
        'k10temp',
    ];

    private static readonly _HWMON_PATH = '/sys/class/hwmon';
    private static readonly _THERMAL_PATH = '/sys/class/thermal';
    private static readonly _THERMAL_FALLBACK = '/sys/class/thermal/thermal_zone0/temp';

    /**
     * Auto-discovers the best CPU temperature sensor available on the system
     */
    public static discover(): string | undefined {
        const prioritySensor = this._findPrioritySensor();
        if (prioritySensor) return prioritySensor;

        if (this.isValid(this._THERMAL_FALLBACK)) return this._THERMAL_FALLBACK;

        return;
    }

    /**
     * Gets all available temperature sensors on the system
     */
    public static getAllSensors(): SensorInfo[] {
        const hwmonSensors = this._getAllHwmonSensors();
        const thermalSensors = this._getAllThermalSensors();

        return [...hwmonSensors, ...thermalSensors];
    }

    /**
     * Validates if sensor path exists and is readable
     *
     * @param path - Sensor file path to validate
     */
    public static isValid(path: string): boolean {
        try {
            const [success] = GLib.file_get_contents(path);
            return success;
        } catch {
            return false;
        }
    }

    /**
     * Searches for priority CPU sensors (Intel coretemp, AMD k10temp) in order of preference
     */
    private static _findPrioritySensor(): string | undefined {
        for (const sensorName of this._PRIORITY_SENSORS) {
            const sensor = this._findHwmonSensor(sensorName);

            if (!sensor || !this.isValid(sensor)) continue;

            return sensor;
        }

        return;
    }

    /**
     * Finds a specific hardware monitor sensor by chip name
     *
     * @param chipName - Name of the chip to search for (e.g., 'coretemp', 'k10temp')
     */
    private static _findHwmonSensor(chipName: string): string | undefined {
        const dir = this._openDirectory(this._HWMON_PATH);
        if (!dir) return;

        try {
            return this._searchDirectoryForChip(dir, chipName);
        } finally {
            dir.close();
        }
    }

    /**
     * Searches through a directory for a specific chip by name
     *
     * @param dir - Open directory handle to search through
     * @param chipName - Name of the chip to find
     */
    private static _searchDirectoryForChip(dir: GLib.Dir, chipName: string): string | undefined {
        let dirname: string | null;

        while ((dirname = dir.read_name()) !== null) {
            const sensor = this._checkHwmonDir(dirname, chipName);
            if (sensor) return sensor;
        }

        return;
    }

    /**
     * Checks if a hwmon directory contains the specified chip and returns its temp sensor path
     *
     * @param dirname - Directory name to check (e.g., 'hwmon0')
     * @param chipName - Expected chip name to match against
     */
    private static _checkHwmonDir(dirname: string, chipName: string): string | undefined {
        const nameFile = `${this._HWMON_PATH}/${dirname}/name`;
        const name = this._readFileContent(nameFile);

        if (!name || name !== chipName) return;

        return `${this._HWMON_PATH}/${dirname}/temp1_input`;
    }

    /**
     * Collects all hardware monitor sensors from the system
     */
    private static _getAllHwmonSensors(): SensorInfo[] {
        const dir = this._openDirectory(this._HWMON_PATH);
        if (!dir) return [];

        try {
            return this._collectHwmonSensors(dir);
        } finally {
            dir.close();
        }
    }

    /**
     * Iterates through hwmon directory entries and collects valid sensor information
     *
     * @param dir - Open hwmon directory handle
     */
    private static _collectHwmonSensors(dir: GLib.Dir): SensorInfo[] {
        const sensors: SensorInfo[] = [];
        let dirname: string | null;

        while ((dirname = dir.read_name()) !== null) {
            const sensor = this._createHwmonSensorInfo(dirname);
            if (sensor) sensors.push(sensor);
        }

        return sensors;
    }

    /**
     * Creates sensor info object for a hwmon device if it has valid temperature input
     * @param dirname - hwmon directory name (e.g., 'hwmon0')
     */
    private static _createHwmonSensorInfo(dirname: string): SensorInfo | undefined {
        const nameFile = `${this._HWMON_PATH}/${dirname}/name`;
        const name = this._readFileContent(nameFile);

        if (!name) return;

        const tempPath = `${this._HWMON_PATH}/${dirname}/temp1_input`;
        if (!this.isValid(tempPath)) return;

        return {
            path: tempPath,
            name,
            type: 'hwmon',
        };
    }

    /**
     * Collects all thermal zone sensors from the system
     */
    private static _getAllThermalSensors(): SensorInfo[] {
        const dir = this._openDirectory(this._THERMAL_PATH);
        if (!dir) return [];

        try {
            return this._collectThermalSensors(dir);
        } finally {
            dir.close();
        }
    }

    /**
     * Iterates through thermal zone entries and collects valid sensor information
     *
     * @param dir - Open thermal directory handle
     */
    private static _collectThermalSensors(dir: GLib.Dir): SensorInfo[] {
        const sensors: SensorInfo[] = [];
        let dirname: string | null;

        while ((dirname = dir.read_name()) !== null) {
            if (!dirname.startsWith('thermal_zone')) continue;

            const sensor = this._createThermalSensorInfo(dirname);
            if (sensor) sensors.push(sensor);
        }

        return sensors;
    }

    /**
     * Creates sensor info object for a thermal zone if it has valid temperature file
     *
     * @param dirname - Thermal zone directory name (e.g., 'thermal_zone0')
     */
    private static _createThermalSensorInfo(dirname: string): SensorInfo | undefined {
        const tempPath = `${this._THERMAL_PATH}/${dirname}/temp`;
        if (!this.isValid(tempPath)) return;

        return {
            path: tempPath,
            name: dirname,
            type: 'thermal',
        };
    }

    /**
     * Safely opens a directory for reading, returns undefined on failure
     *
     * @param path - Full path to the directory to open
     */
    private static _openDirectory(path: string): GLib.Dir | undefined {
        try {
            return GLib.Dir.open(path, 0);
        } catch {
            return;
        }
    }

    /**
     * Reads and returns trimmed file content, returns undefined on failure
     *
     * @param path - Full path to the file to read
     */
    private static _readFileContent(path: string): string | undefined {
        try {
            const [success, bytes] = GLib.file_get_contents(path);
            if (!success || !bytes) return;
            return new TextDecoder('utf-8').decode(bytes).trim();
        } catch {
            return;
        }
    }
}
