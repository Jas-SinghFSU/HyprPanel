import { BarToggleStates } from './types';

export class BarVisibility {
    private static _toggleStates: BarToggleStates = {};

    public static get(barName: string): boolean {
        return this._toggleStates[barName] ?? true;
    }

    public static set(barName: string, isVisible: boolean): void {
        this._toggleStates[barName] = isVisible;
    }
}
