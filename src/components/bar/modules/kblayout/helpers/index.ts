import {
    HyprctlDeviceLayout,
    HyprctlKeyboard,
    KbLabelType,
    LayoutKeys,
    LayoutValues,
} from 'src/lib/types/customModules/kbLayout';
import { layoutMap } from './layouts';

/**
 * Retrieves the keyboard layout from a given JSON string and format.
 *
 * This function parses the provided JSON string to extract the keyboard layout information.
 * It returns the layout in the specified format, either as a code or a human-readable string.
 *
 * @param obj The JSON string containing the keyboard layout information.
 * @param format The format in which to return the layout, either 'code' or 'label'.
 *
 * @returns The keyboard layout in the specified format. If no keyboards are found, returns 'Unknown' or 'Unknown Layout'.
 */
export const getKeyboardLayout = (obj: string, format: KbLabelType): LayoutKeys | LayoutValues => {
    const hyprctlDevices: HyprctlDeviceLayout = JSON.parse(obj);
    const keyboards = hyprctlDevices['keyboards'];

    if (keyboards.length === 0) {
        return format === 'code' ? 'Unknown' : 'Unknown Layout';
    }

    let mainKb = keyboards.find((kb: HyprctlKeyboard) => kb.main);

    if (!mainKb) {
        mainKb = keyboards[keyboards.length - 1];
    }

    const layout: LayoutKeys = mainKb['active_keymap'] as LayoutKeys;
    const foundLayout: LayoutValues = layoutMap[layout];

    return format === 'code' ? foundLayout || layout : layout;
};
