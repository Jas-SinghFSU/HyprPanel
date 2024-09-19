import Gtk from 'gi://Gtk?version=3.0';
import Gio from 'gi://Gio';
import { bash, Notify } from 'lib/utils';
import icons from 'lib/icons';
import { Config } from 'lib/types/filechooser';
import { hexColorPattern } from 'globals/useTheme';
import { isHexColor } from 'globals/variables';

const whiteListedThemeProp = ['theme.bar.buttons.style'];

export const loadJsonFile = (filePath: string): Config | null => {
    const file = Gio.File.new_for_path(filePath as string);
    const [success, content] = file.load_contents(null);

    if (!success) {
        console.error(`Failed to import: ${filePath}`);
        return null;
    }

    const jsonString = new TextDecoder('utf-8').decode(content);
    return JSON.parse(jsonString);
};

export const saveConfigToFile = (config: object, filePath: string): void => {
    const file = Gio.File.new_for_path(filePath);
    const outputStream = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
    const dataOutputStream = new Gio.DataOutputStream({ base_stream: outputStream });

    const jsonString = JSON.stringify(config, null, 2);
    dataOutputStream.put_string(jsonString, null);
    dataOutputStream.close(null);
};

export const filterConfigForThemeOnly = (config: Config): Config => {
    const filteredConfig: Config = {};

    for (const key in config) {
        const value = config[key];
        if (typeof value === 'string' && hexColorPattern.test(value)) {
            filteredConfig[key] = config[key];
        } else if (whiteListedThemeProp.includes(key)) {
            filteredConfig[key] = config[key];
        }
    }
    return filteredConfig;
};

export const filterConfigForNonTheme = (config: Config): Config => {
    const filteredConfig: Config = {};
    for (const key in config) {
        if (whiteListedThemeProp.includes(key)) {
            continue;
        }

        const value = config[key];
        if (!(typeof value === 'string' && hexColorPattern.test(value))) {
            filteredConfig[key] = config[key];
        }
    }
    return filteredConfig;
};

export const saveFileDialog = (filePath: string, themeOnly: boolean): void => {
    const original_file_path = filePath;

    const file = Gio.File.new_for_path(original_file_path);
    const [success, content] = file.load_contents(null);

    if (!success) {
        console.error(`Could not find 'config.json' at ${TMP}`);
        return;
    }

    const jsonString = new TextDecoder('utf-8').decode(content);
    const jsonObject = JSON.parse(jsonString);

    // Function to filter hex color pairs
    const filterHexColorPairs = (jsonObject: Config): Config => {
        const filteredObject: Config = {};

        for (const key in jsonObject) {
            const value = jsonObject[key];
            if (typeof value === 'string' && isHexColor(value)) {
                filteredObject[key] = jsonObject[key];
            } else if (whiteListedThemeProp.includes(key)) {
                filteredObject[key] = jsonObject[key];
            }
        }

        return filteredObject;
    };

    // Function to filter out hex color pairs (keep only non-hex color value)
    const filterOutHexColorPairs = (jsonObject: Config): Config => {
        const filteredObject: Config = {};

        for (const key in jsonObject) {
            // do not add key-value pair if its in whiteListedThemeProp
            if (whiteListedThemeProp.includes(key)) {
                continue;
            }

            const value = jsonObject[key];
            if (!(typeof value === 'string' && isHexColor(value))) {
                filteredObject[key] = jsonObject[key];
            }
        }

        return filteredObject;
    };

    // Filter the JSON object based on the themeOnly flag
    const filteredJsonObject = themeOnly ? filterHexColorPairs(jsonObject) : filterOutHexColorPairs(jsonObject);
    const filteredContent = JSON.stringify(filteredJsonObject, null, 2);

    const dialog = new Gtk.FileChooserDialog({
        title: 'Save File As',
        action: Gtk.FileChooserAction.SAVE,
    });

    dialog.add_button(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL);
    dialog.add_button(Gtk.STOCK_SAVE, Gtk.ResponseType.ACCEPT);
    dialog.set_current_name(themeOnly ? 'hyprpanel_theme.json' : 'hyprpanel_config.json');

    const response = dialog.run();

    if (response === Gtk.ResponseType.ACCEPT) {
        const file_path = dialog.get_filename();
        console.info(`Original file path: ${file_path}`);

        const getIncrementedFilePath = (filePath: string): string => {
            let increment = 1;
            const baseName = filePath.replace(/(\.\w+)$/, '');
            const match = filePath.match(/(\.\w+)$/);
            const extension = match ? match[0] : '';

            let newFilePath = filePath;
            let file = Gio.File.new_for_path(newFilePath);

            while (file.query_exists(null)) {
                newFilePath = `${baseName}_${increment}${extension}`;
                file = Gio.File.new_for_path(newFilePath);
                increment++;
            }

            return newFilePath;
        };

        const finalFilePath = getIncrementedFilePath(file_path as string);
        console.info(`File will be saved at: ${finalFilePath}`);

        try {
            const save_file = Gio.File.new_for_path(finalFilePath);
            const outputStream = save_file.replace(null, false, Gio.FileCreateFlags.NONE, null);
            const dataOutputStream = new Gio.DataOutputStream({
                base_stream: outputStream,
            });

            dataOutputStream.put_string(filteredContent, null);

            dataOutputStream.close(null);

            Notify({
                summary: 'File Saved Successfully',
                body: `At ${finalFilePath}.`,
                iconName: icons.ui.info,
                timeout: 5000,
            });
        } catch (e) {
            if (e instanceof Error) {
                console.error('Failed to write to file:', e.message);
            }
        }
    }

    dialog.destroy();
};

export const importFiles = (themeOnly: boolean = false): void => {
    const dialog = new Gtk.FileChooserDialog({
        title: `Import ${themeOnly ? 'Theme' : 'Config'}`,
        action: Gtk.FileChooserAction.OPEN,
    });
    dialog.set_current_folder(`${App.configDir}/themes`);
    dialog.add_button(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL);
    dialog.add_button(Gtk.STOCK_OPEN, Gtk.ResponseType.ACCEPT);

    const response = dialog.run();

    if (response === Gtk.ResponseType.CANCEL) {
        dialog.destroy();
        return;
    }
    if (response === Gtk.ResponseType.ACCEPT) {
        const filePath: string | null = dialog.get_filename();

        if (filePath === null) {
            Notify({
                summary: 'Failed to import',
                body: 'No file selected.',
                iconName: icons.ui.warning,
                timeout: 5000,
            });
            return;
        }

        const importedConfig = loadJsonFile(filePath);

        if (!importedConfig) {
            dialog.destroy();
            return;
        }

        Notify({
            summary: `Importing ${themeOnly ? 'Theme' : 'Config'}`,
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
            dialog.destroy();
            return;
        }

        let tmpConfig = JSON.parse(new TextDecoder('utf-8').decode(tmpContent));
        let optionsConfig = JSON.parse(new TextDecoder('utf-8').decode(optionsContent));

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
    }
    dialog.destroy();
    bash('pkill ags && ags');
};
