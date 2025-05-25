import { bind, Variable } from 'astal';
import GLib from 'gi://GLib?version=2.0';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { CpuTempServiceCtor } from './types';

class CpuTempService {
    private _sensor: Variable<string>;
    private _updateFrequency: Variable<number>;
    private _tempPoller: FunctionPoller<number, []>;
    private _temperature = Variable(0);

    constructor({ sensor, frequency }: CpuTempServiceCtor = {}) {
        this._sensor = sensor ?? Variable('/sys/class/thermal/thermal_zone0/temp');
        this._updateFrequency = frequency || Variable(2000);

        this._readTemperature = this._readTemperature.bind(this);

        this._tempPoller = new FunctionPoller<number, []>(
            this._temperature,
            [],
            bind(this._updateFrequency),
            this._readTemperature,
        );

        this._tempPoller.initialize();
    }

    /**
     * Reads CPU temperature from the sensor file and returns it in Celsius
     */
    private _readTemperature(): number {
        try {
            const sensorPath = this._sensor.get();
            if (sensorPath.length === 0) {
                return 0;
            }

            const [success, tempBytes] = GLib.file_get_contents(sensorPath);
            if (!success || tempBytes === null) {
                console.error(`Failed to read temperature from ${sensorPath}`);
                return 0;
            }

            const tempInfo = new TextDecoder('utf-8').decode(tempBytes);
            const tempValueMillidegrees = parseInt(tempInfo.trim(), 10);
            const tempValueDegrees = tempValueMillidegrees / 1000;

            return tempValueDegrees;
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
