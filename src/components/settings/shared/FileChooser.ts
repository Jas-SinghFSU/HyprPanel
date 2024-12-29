import options from '../../../options';
import Gtk from 'gi://Gtk?version=3.0';
import Gio from 'gi://Gio';
import { bash, Notify } from '../../../lib/utils';
import icons from '../../../lib/icons/icons';
import { Config } from '../../../lib/types/filechooser';
import { hexColorPattern } from '../../../globals/useTheme';
import { isHexColor } from '../../../globals/variables';

const { restartCommand } = options.hyprpanel;
const whiteListedThemeProp = ['theme.bar.buttons.style'];

/**
 * Loads a JSON file from the specified file path and parses it.
 * If the file cannot be loaded or parsed, it logs an error and returns null.
 *
 * @param filePath - The path to the JSON file to be loaded.
 * @returns The parsed JavaScript object or null if the file could not be loaded or parsed.
 */
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

/**
 * Saves an object as a JSON file to the specified file path.
 * If the file cannot be saved, it logs an error.
 *
 * @param config - The JavaScript object to be saved as a JSON file.
 * @param filePath - The path where the JSON file will be saved.
 */
export const saveConfigToFile = (config: object, filePath: string): void => {
    const file = Gio.File.new_for_path(filePath);
    const outputStream = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
    const dataOutputStream = new Gio.DataOutputStream({ base_stream: outputStream });

    const jsonString = JSON.stringify(config, null, 2);
    dataOutputStream.put_string(jsonString, null);
    dataOutputStream.close(null);
};

/**
 * Filters the given configuration object to include only theme-related properties.
 * Theme-related properties are identified by their keys matching a hex color pattern or being in the whitelist.
 *
 * @param config - The configuration object to be filtered.
 * @returns A new configuration object containing only theme-related properties.
 */
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

/**
 * Filters the given configuration object to exclude theme-related properties.
 * Theme-related properties are identified by their keys matching a hex color pattern or being in the whitelist.
 *
 * @param config - The configuration object to be filtered.
 * @returns A new configuration object excluding theme-related properties.
 */
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

/**
 * Opens a file save dialog to save the current configuration to a specified file path.
 * The configuration can be filtered to include only theme-related properties if the themeOnly flag is set.
 * If the file already exists, it increments the file name to avoid overwriting.
 * Displays a notification upon successful save or logs an error if the save fails.
 *
 * @param filePath - The original file path where the configuration is to be saved.
 * @param themeOnly - A flag indicating whether to save only theme-related properties.
 */
export const saveFileDialog = (filePath: string, themeOnly: boolean): void => {
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

    const filterOutHexColorPairs = (jsonObject: Config): Config => {
        const filteredObject: Config = {};

        for (const key in jsonObject) {
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

    const dialog = new Gtk.FileChooserDialog({
        title: `Save Hyprpanel ${themeOnly ? 'Theme' : 'Config'}`,
        action: Gtk.FileChooserAction.SAVE,
    });

    dialog.add_button(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL);
    dialog.add_button(Gtk.STOCK_SAVE, Gtk.ResponseType.ACCEPT);
    dialog.set_current_name(themeOnly ? 'hyprpanel_theme.json' : 'hyprpanel_config.json');
    dialog.get_style_context().add_class('hyprpanel-file-chooser');

    const response = dialog.run();

    try {
        const original_file_path = filePath;

        const file = Gio.File.new_for_path(original_file_path);
        const [success, content] = file.load_contents(null);

        if (!success) {
            console.error(`Could not find 'config.json' at ${TMP}`);
            return;
        }

        const jsonString = new TextDecoder('utf-8').decode(content);
        const jsonObject = JSON.parse(jsonString);

        const filteredJsonObject = themeOnly ? filterHexColorPairs(jsonObject) : filterOutHexColorPairs(jsonObject);
        const filteredContent = JSON.stringify(filteredJsonObject, null, 2);

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
                });
            } catch (e) {
                if (e instanceof Error) {
                    console.error('Failed to write to file:', e.message);
                }
            }
        }

        dialog.destroy();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        dialog.destroy();

        Notify({
            summary: `${themeOnly ? 'Theme' : 'Config'} Export Failed`,
            body: errorMessage ?? 'An unknown error occurred.',
            iconName: icons.ui.warning,
        });
    }
};

/**
 * Opens a file chooser dialog to import a configuration file.
 * The imported configuration can be filtered to include only theme-related properties if the themeOnly flag is set.
 * Merges the imported configuration with the existing configuration and saves the result.
 * Displays a notification upon successful import or logs an error if the import fails.
 *
 * @param themeOnly - A flag indicating whether to import only theme-related properties.
 */
export const importFiles = (themeOnly: boolean = false): void => {
    const dialog = new Gtk.FileChooserDialog({
        title: `Import Hyprpanel ${themeOnly ? 'Theme' : 'Config'}`,
        action: Gtk.FileChooserAction.OPEN,
    });
    dialog.set_current_folder(`${SRC_DIR}/themes`);
    dialog.add_button(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL);
    dialog.add_button(Gtk.STOCK_OPEN, Gtk.ResponseType.ACCEPT);
    dialog.get_style_context().add_class('hyprpanel-file-chooser');

    const response = dialog.run();

    try {
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
            });

            const tmpConfigFile = Gio.File.new_for_path(`${TMP}/config.json`);
            const optionsConfigFile = Gio.File.new_for_path(CONFIG);

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
            saveConfigToFile(optionsConfig, CONFIG);
        }
        dialog.destroy();
        bash(restartCommand.get());
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        dialog.destroy();

        Notify({
            summary: `${themeOnly ? 'Theme' : 'Config'} Import Failed`,
            body: errorMessage ?? 'An unknown error occurred.',
            iconName: icons.ui.warning,
        });
    }
};
