import { BarToggleStates } from './types';

/**
 * Service that manages the visibility state of bars across different monitors
 */
export class BarVisibility {
    private static _toggleStates: BarToggleStates = {};

    /**
     * Gets the visibility state of a specific bar
     *
     * @param barName - The name identifier of the bar
     * @returns Whether the bar is visible (defaults to true if not set)
     */
    public static get(barName: string): boolean {
        return this._toggleStates[barName] ?? true;
    }

    /**
     * Sets the visibility state of a specific bar
     *
     * @param barName - The name identifier of the bar
     * @param isVisible - Whether the bar should be visible
     */
    public static set(barName: string, isVisible: boolean): void {
        this._toggleStates[barName] = isVisible;
    }
}
