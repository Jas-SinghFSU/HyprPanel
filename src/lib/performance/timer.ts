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
     * Stops the timer and logs the elapsed time with the configured label
     * Returns the elapsed time in milliseconds for further processing
     */
    public end(): number {
        const elapsed = (GLib.get_monotonic_time() - this._startTime) / 1000;
        console.log(`${this._label}: ${elapsed.toFixed(1)}ms`);
        return elapsed;
    }

    /**
     * Retrieves the current elapsed time without stopping the timer
     * Useful for intermediate measurements during long-running operations
     */
    public elapsed(): number {
        return (GLib.get_monotonic_time() - this._startTime) / 1000;
    }

    /**
     * Wraps an async function with automatic performance timing
     * Logs execution time regardless of success or failure
     *
     * @param label - Description of the operation being measured
     * @param fn - Async function to measure
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
     * Wraps a synchronous function with automatic performance timing
     * Logs execution time regardless of success or failure
     *
     * @param label - Description of the operation being measured
     * @param fn - Synchronous function to measure
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
