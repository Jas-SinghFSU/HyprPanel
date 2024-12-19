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

        const tmpConfigFile = Gio.File.new_for_path(`${TMP}/config.json`);
        const optionsConfigFile = Gio.File.new_for_path(CONFIG);

        const [tmpSuccess, tmpContent] = tmpConfigFile.load_contents(null);
        const [optionsSuccess, optionsContent] = optionsConfigFile.load_contents(null);

        if (!tmpSuccess || !optionsSuccess) {
            throw new Error('Failed to load theme file.');
        }

        let tmpConfig = JSON.parse(new TextDecoder('utf-8').decode(tmpContent));
        let optionsConfig = JSON.parse(new TextDecoder('utf-8').decode(optionsContent));

        const filteredConfig = filterConfigForThemeOnly(importedConfig);
        tmpConfig = { ...tmpConfig, ...filteredConfig };
        optionsConfig = { ...optionsConfig, ...filteredConfig };

        saveConfigToFile(tmpConfig, `${TMP}/config.json`);
        saveConfigToFile(optionsConfig, CONFIG);
        bash(restartCommand.get());
    } catch (error) {
        errorHandler(error);
    }
};
