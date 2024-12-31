import { hyprlandService } from '../constants/services';

const floatSettingsDialog = (): void => {
    hyprlandService.message(`keyword windowrulev2 float, title:^(hyprpanel-settings)$`);

    hyprlandService.connect('config-reloaded', () => {
        hyprlandService.message(`keyword windowrulev2 float, title:^(hyprpanel-settings)$`);
    });
};

const floatFilePicker = (): void => {
    hyprlandService.message(`keyword windowrulev2 float, title:^((Save|Import) Hyprpanel.*)$`);

    hyprlandService.connect('config-reloaded', () => {
        hyprlandService.message(`keyword windowrulev2 float, title:^((Save|Import) Hyprpanel.*)$`);
    });
};

export const hyprlandSettings = (): void => {
    floatSettingsDialog();
    floatFilePicker();
};
