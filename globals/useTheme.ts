import Gio from "gi://Gio"
import { bash, Notify } from "lib/utils";
import icons from "lib/icons"
import { filterConfigForThemeOnly, loadJsonFile, saveConfigToFile } from "widget/settings/shared/FileChooser";

globalThis.useTheme = (filePath: string): void => {
    let importedConfig = loadJsonFile(filePath);

    if (!importedConfig) {
        return;
    }

    Notify({
        summary: `Importing Theme`,
        body: `Importing: ${filePath}`,
        iconName: icons.ui.info,
        timeout: 7000
    });

    let tmpConfigFile = Gio.File.new_for_path(`${TMP}/config.json`);
    let optionsConfigFile = Gio.File.new_for_path(OPTIONS);

    let [tmpSuccess, tmpContent] = tmpConfigFile.load_contents(null);
    let [optionsSuccess, optionsContent] = optionsConfigFile.load_contents(null);

    if (!tmpSuccess || !optionsSuccess) {
        console.error("Failed to read existing configuration files.");
        return;
    }

    let tmpConfig = JSON.parse(new TextDecoder("utf-8").decode(tmpContent));
    let optionsConfig = JSON.parse(new TextDecoder("utf-8").decode(optionsContent));

    const filteredConfig = filterConfigForThemeOnly(importedConfig);
    tmpConfig = { ...tmpConfig, ...filteredConfig };
    optionsConfig = { ...optionsConfig, ...filteredConfig };

    saveConfigToFile(tmpConfig, `${TMP}/config.json`);
    saveConfigToFile(optionsConfig, OPTIONS);
    bash("pkill ags && ags");
}

