import Gio from 'gi://Gio';
import { bash, Notify } from 'lib/utils';
import icons from 'lib/icons';
import { filterConfigForThemeOnly, loadJsonFile, saveConfigToFile } from 'widget/settings/shared/FileChooser';

export const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

globalThis.useTheme = (filePath: string): void => {
    const importedConfig = loadJsonFile(filePath);

    if (!importedConfig) {
        return;
    }

    Notify({
        summary: `Importing Theme`,
        body: `Importing: ${filePath}`,
        iconName: icons.ui.info,
        timeout: 7000,
    });

    const tmpConfigFile = Gio.File.new_for_path(`${TMP}/config.json`);
    const optionsConfigFile = Gio.File.new_for_path(OPTIONS);

    const [tmpSuccess, tmpContent] = tmpConfigFile.load_contents(null);
    const [optionsSuccess, optionsContent] = optionsConfigFile.load_contents(null);

    if (!tmpSuccess || !optionsSuccess) {
        console.error('Failed to read existing configuration files.');
        return;
    }

    let tmpConfig = JSON.parse(new TextDecoder('utf-8').decode(tmpContent));
    let optionsConfig = JSON.parse(new TextDecoder('utf-8').decode(optionsContent));

    const filteredConfig = filterConfigForThemeOnly(importedConfig);
    tmpConfig = { ...tmpConfig, ...filteredConfig };
    optionsConfig = { ...optionsConfig, ...filteredConfig };

    saveConfigToFile(tmpConfig, `${TMP}/config.json`);
    saveConfigToFile(optionsConfig, OPTIONS);
    bash('pkill ags && ags');
};
