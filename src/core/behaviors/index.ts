import '../../services/display/bar/autoHide';
import { warnOnLowBattery } from './batteryWarning';
import { hyprlandSettings } from './hyprlandRules';
import { BarAutoHideService } from '../../services/display/bar/autoHide';

const autoHide = BarAutoHideService.getInstance();

export const initializeSystemBehaviors = (): void => {
    warnOnLowBattery();
    autoHide.initialize();
    hyprlandSettings();
};
