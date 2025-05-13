import { Gio, readFileAsync } from 'astal';
import { CustomBarModule, WidgetMap } from './types';
import { ModuleContainer } from './module_container';
import { WidgetContainer } from '../shared/WidgetContainer';

export class CustomModules {
    constructor() {}

    public static async build(): Promise<WidgetMap> {
        const customModuleMap = await this._getCustomModules();
        const customModuleComponents: WidgetMap = {};

        try {
            Object.entries(customModuleMap).map(([moduleName, moduleMetadata]) => {
                if (!moduleName.startsWith('custom/')) {
                    return;
                }

                customModuleComponents[moduleName] = (): JSX.Element =>
                    WidgetContainer(ModuleContainer(moduleName, moduleMetadata));
            });

            return customModuleComponents;
        } catch (error) {
            console.error(`Failed to build custom modules in ${CONFIG_DIR}: ${error}`);
            throw new Error(`Failed to build custom modules in ${CONFIG_DIR}: ${error}`);
        }
    }

    private static async _getCustomModules(): Promise<Record<string, CustomBarModule>> {
        try {
            const filesInConfigDir = await this._getFilesInConfigDir();
            const modulesFile = filesInConfigDir.find((file) => file.match(/^modules(\.json)?$/));
            const pathToModulesFile = `${CONFIG_DIR}/${modulesFile}`;

            const customModulesFileContent = await readFileAsync(pathToModulesFile);

            const modulesObject = JSON.parse(customModulesFileContent);

            return modulesObject;
        } catch (error) {
            throw new Error(`Failed to parse modules file in ${CONFIG_DIR}: ${error}`);
        }
    }

    private static async _getFilesInConfigDir(): Promise<string[]> {
        const file = Gio.File.new_for_path(CONFIG_DIR);
        const enumerator = file.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NONE, null);
        const fileNames = [];

        for (const info of enumerator) {
            const fileType = info.get_file_type();
            const fileName = info.get_name();

            if (fileType === Gio.FileType.REGULAR) {
                fileNames.push(fileName);
            }
        }

        enumerator.close(null);
        return fileNames;
    }
}
