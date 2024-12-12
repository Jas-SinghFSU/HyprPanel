import './autoHide';
import { warnOnLowBattery } from './batteryWarning';

export const initializeSystemBehaviors = (): void => {
    warnOnLowBattery();
};
