import Gio from 'gi://Gio';
import {
    filterConfigForThemeOnly,
    loadJsonFile,
    saveConfigToFile,
} from '../../components/settings/shared/FileChooser';
import options from 'src/configuration';
import { errorHandler } from 'src/core/errors/handler';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

const { restartCommand } = options.hyprpanel;
export const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export function useTheme(filePath: string): void {
    try {
        const importedConfig = loadJsonFile(filePath);

        if (!importedConfig) {
            return;
        }

        const optionsConfigFile = Gio.File.new_for_path(CONFIG_FILE);

        const [optionsSuccess, optionsContent] = optionsConfigFile.load_contents(null);

        if (!optionsSuccess) {
            throw new Error('Failed to load theme file.');
        }

        let optionsConfig = JSON.parse(new TextDecoder('utf-8').decode(optionsContent));

        const filteredConfig = filterConfigForThemeOnly(importedConfig);
        optionsConfig = { ...optionsConfig, ...filteredConfig };

        saveConfigToFile(optionsConfig, CONFIG_FILE);
        SystemUtilities.bash(restartCommand.get());
    } catch (error) {
        errorHandler(error);
    }
}
