import { bind, Variable } from 'astal';
import GLib from 'gi://GLib?version=2.0';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { CpuTempServiceCtor } from './types';
import { CpuTempSensorDiscovery } from './sensorDiscovery';

class CpuTempService {
    private _sensor: Variable<string>;
    private _updateFrequency: Variable<number>;
    private _tempPoller: FunctionPoller<number, []>;
    private _isInitialized = false;
    private _temperature = Variable(0);
    private _resolvedSensorPath?: string;

    constructor({ sensor, frequency }: CpuTempServiceCtor = {}) {
        this._sensor = sensor ?? Variable('auto');
        this._updateFrequency = frequency || Variable(2000);

        this._readTemperature = this._readTemperature.bind(this);

        this._tempPoller = new FunctionPoller<number, []>(
            this._temperature,
            [],
            bind(this._updateFrequency),
            this._readTemperature,
        );

        this._sensor.subscribe(() => this._resolveSensorPath());
    }

    /**
     * Resolves the sensor path based on configuration
     */
    private _resolveSensorPath(): void {
        const sensorValue = this._sensor.get();

        if (sensorValue === 'auto' || sensorValue === '') {
            this._resolvedSensorPath = CpuTempSensorDiscovery.discover();
            if (!this._resolvedSensorPath) console.error('No CPU temperature sensor found');
            return;
        }

        if (CpuTempSensorDiscovery.isValid(sensorValue)) {
            this._resolvedSensorPath = sensorValue;
            return;
        }

        console.error(`Invalid sensor: ${sensorValue}, falling back to auto-discovery`);
        this._resolvedSensorPath = CpuTempSensorDiscovery.discover();
    }

    /**
     * Reads CPU temperature from the sensor file and returns it in Celsius
     */
    private _readTemperature(): number {
        if (!this._resolvedSensorPath) return 0;

        try {
            const [success, tempBytes] = GLib.file_get_contents(this._resolvedSensorPath);
            if (!success || !tempBytes) return 0;

            const tempInfo = new TextDecoder('utf-8').decode(tempBytes);
            const tempValueMillidegrees = parseInt(tempInfo.trim(), 10);
            return tempValueMillidegrees / 1000;
        } catch (error) {
            console.error('Error reading CPU temperature:', error);
            return 0;
        }
    }

    public get temperature(): Variable<number> {
        return this._temperature;
    }

    public get sensor(): Variable<string> {
        return this._sensor;
    }

    public get currentSensorPath(): string | undefined {
        return this._resolvedSensorPath;
    }

    public refresh(): void {
        this._temperature.set(this._readTemperature());
    }

    public updateSensor(sensor: string): void {
        this._sensor.set(sensor);
        this.refresh();
    }

    public updateFrequency(frequency: number): void {
        this._updateFrequency.set(frequency);
    }

    /**
     * Initializes the CPU temperature monitoring poller
     */
    public initialize(): void {
        if (this._isInitialized) return;

        this._resolveSensorPath();
        this._tempPoller.initialize();
        this._isInitialized = true;
    }

    public stopPoller(): void {
        this._tempPoller.stop();
    }

    public startPoller(): void {
        this._tempPoller.start();
    }

    public destroy(): void {
        this._tempPoller.stop();
        this._temperature.drop();
        this._sensor.drop();
        this._updateFrequency.drop();
    }
}

export default CpuTempService;
