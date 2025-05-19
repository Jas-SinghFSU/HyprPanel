import { ThemeExportData } from 'src/lib/options/types';
import { importFiles, saveFileDialog } from '../FileChooser';
import { isPrimaryClick } from 'src/lib/events/mouse';

export const ImportInputter = ({ exportData }: ImportInputterProps): JSX.Element => {
    return (
        <box>
            <button
                className="options-import"
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        importFiles(exportData?.themeOnly as boolean);
                    }
                }}
            >
                <label label="import" />
            </button>
            <button
                className="options-export"
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        saveFileDialog(exportData?.filePath as string, exportData?.themeOnly as boolean);
                    }
                }}
            >
                <label label="export" />
            </button>
        </box>
    );
};

interface ImportInputterProps {
    exportData?: ThemeExportData;
}
