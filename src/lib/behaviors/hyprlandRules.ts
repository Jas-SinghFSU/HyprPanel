import { execAsync } from 'astal';
import { hyprlandService } from '../constants/services';

const floatSettingsDialog = (): void => {
    execAsync(['bash', '-c', 'hyprctl keyword windowrulev2 "float, title:^(hyprpanel-settings)$"']);

    hyprlandService.connect('config-reloaded', () => {
        execAsync(['bash', '-c', 'hyprctl keyword windowrulev2 "float, title:^(hyprpanel-settings)$"']);
    });
};

export const hyprlandSettings = (): void => {
    floatSettingsDialog();
};
