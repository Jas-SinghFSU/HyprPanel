import Gio from "gi://Gio"
import { bash, Notify } from "lib/utils";
import icons from "lib/icons"

globalThis.useTheme = (filePath: string): void => {
    const themeOnly = true;
    let file = Gio.File.new_for_path(filePath as string);
    let [success, content] = file.load_contents(null);

    if (!success) {
        console.error(`Failed to import: ${filePath}`);
        return;
    }

    Notify({
        summary: `Importing ${themeOnly ? "Theme" : "Config"}`,
        body: `Importing: ${filePath}`,
        iconName: icons.ui.info,
        timeout: 7000
    });

    let jsonString = new TextDecoder("utf-8").decode(content);
    let importedConfig = JSON.parse(jsonString);

    const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

    const saveConfigToFile = (config: object, filePath: string) => {
        let file = Gio.File.new_for_path(filePath);
        let outputStream = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
        let dataOutputStream = new Gio.DataOutputStream({ base_stream: outputStream });

        let jsonString = JSON.stringify(config, null, 2);
        dataOutputStream.put_string(jsonString, null);
        dataOutputStream.close(null);
    };

    const filterConfigForThemeOnly = (config: object) => {
        let filteredConfig = {};
        for (let key in config) {
            if (typeof config[key] === 'string' && hexColorPattern.test(config[key])) {
                filteredConfig[key] = config[key];
            }
        }
        return filteredConfig;
    };

    const filterConfigForNonTheme = (config: object) => {
        let filteredConfig = {};
        for (let key in config) {
            if (!(typeof config[key] === 'string' && hexColorPattern.test(config[key]))) {
                filteredConfig[key] = config[key];
            }
        }
        return filteredConfig;
    };

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

    if (themeOnly) {
        const filteredConfig = filterConfigForThemeOnly(importedConfig);
        tmpConfig = { ...tmpConfig, ...filteredConfig };
        optionsConfig = { ...optionsConfig, ...filteredConfig };
    } else {
        const filteredConfig = filterConfigForNonTheme(importedConfig);
        tmpConfig = { ...tmpConfig, ...filteredConfig };
        optionsConfig = { ...optionsConfig, ...filteredConfig };
    }

    saveConfigToFile(tmpConfig, `${TMP}/config.json`);
    saveConfigToFile(optionsConfig, OPTIONS);
    bash("pkill ags && ags");
}
