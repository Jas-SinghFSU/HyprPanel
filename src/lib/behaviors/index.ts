import './autoHide';
import { initializeAutoHide } from './autoHide';
import { warnOnLowBattery } from './batteryWarning';
import { hyprlandSettings } from './hyprlandRules';

export const initializeSystemBehaviors = (): void => {
    warnOnLowBattery();
    initializeAutoHide();
    hyprlandSettings();
};
