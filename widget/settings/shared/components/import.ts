import { ThemeExportData } from 'lib/types/options';
import { Attribute, BoxWidget } from 'lib/types/widget';
import { importFiles, saveFileDialog } from '../FileChooser';

export const importInputter = (self: BoxWidget, exportData?: ThemeExportData): Attribute => {
    return (self.child = Widget.Box({
        children: [
            Widget.Button({
                class_name: 'options-import',
                label: 'import',
                on_clicked: () => {
                    importFiles(exportData?.themeOnly as boolean);
                },
            }),
            Widget.Button({
                class_name: 'options-export',
                label: 'export',
                on_clicked: () => {
                    saveFileDialog(exportData?.filePath as string, exportData?.themeOnly as boolean);
                },
            }),
        ],
    }));
};
