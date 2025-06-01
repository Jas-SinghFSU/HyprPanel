import GLib from 'gi://GLib';

/**
 * Performance timing utility for measuring execution time of operations
 */
export class Timer {
    private _startTime: number;
    private _label: string;

    constructor(label: string) {
        this._label = label;
        this._startTime = GLib.get_monotonic_time();
    }

    /**
     * Ends the timer and logs the elapsed time
     */
    public end(): number {
        const elapsed = (GLib.get_monotonic_time() - this._startTime) / 1000;
        console.log(`${this._label}: ${elapsed.toFixed(1)}ms`);
        return elapsed;
    }

    /**
     * Gets elapsed time without ending the timer
     */
    public elapsed(): number {
        return (GLib.get_monotonic_time() - this._startTime) / 1000;
    }

    /**
     * Measures the execution time of an async function
     */
    public static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
        const timer = new Timer(label);
        try {
            const result = await fn();
            timer.end();
            return result;
        } catch (error) {
            timer.end();
            throw error;
        }
    }

    /**
     * Measures the execution time of a synchronous function
     */
    public static measureSync<T>(label: string, fn: () => T): T {
        const timer = new Timer(label);
        try {
            const result = fn();
            timer.end();
            return result;
        } catch (error) {
            timer.end();
            throw error;
        }
    }
}
