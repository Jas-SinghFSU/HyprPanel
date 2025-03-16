import options from '../options';
import Gio from 'gi://Gio';
import { bash, errorHandler } from '../lib/utils';
import { filterConfigForThemeOnly, loadJsonFile, saveConfigToFile } from '../components/settings/shared/FileChooser';

const { restartCommand } = options.hyprpanel;
export const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

globalThis.useTheme = (filePath: string): void => {
    try {
        const importedConfig = loadJsonFile(filePath);

        if (!importedConfig) {
            return;
        }

        const optionsConfigFile = Gio.File.new_for_path(CONFIG);

        const [optionsSuccess, optionsContent] = optionsConfigFile.load_contents(null);

        if (!optionsSuccess) {
            throw new Error('Failed to load theme file.');
        }

        let optionsConfig = JSON.parse(new TextDecoder('utf-8').decode(optionsContent));

        const filteredConfig = filterConfigForThemeOnly(importedConfig);
        optionsConfig = { ...optionsConfig, ...filteredConfig };

        saveConfigToFile(optionsConfig, CONFIG);
        bash(restartCommand.get());
    } catch (error) {
        errorHandler(error);
    }
};
