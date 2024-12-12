import './autoHide';
import { initializeAutoHide } from './autoHide';
import { warnOnLowBattery } from './batteryWarning';

export const initializeSystemBehaviors = (): void => {
    warnOnLowBattery();
    initializeAutoHide();
};
