import { LayoutKeys, layoutMap, LayoutValues } from './layouts';
import { KbLabelType, HyprctlDeviceLayout, HyprctlKeyboard } from './types';

/**
 * Retrieves the keyboard layout from a given JSON string and format.
 *
 * This function parses the provided JSON string to extract the keyboard layout information.
 * It returns the layout in the specified format, either as a code or a human-readable string.
 *
 * @param layoutData The JSON string containing the keyboard layout information.
 * @param format The format in which to return the layout, either 'code' or 'label'.
 *
 * @returns The keyboard layout in the specified format. If no keyboards are found, returns 'Unknown' or 'Unknown Layout'.
 */
export const getKeyboardLayout = (layoutData: string, format: KbLabelType): LayoutKeys | LayoutValues => {
    const hyprctlDevices: HyprctlDeviceLayout = JSON.parse(layoutData);
    const keyboards = hyprctlDevices['keyboards'];

    if (keyboards.length === 0) {
        return format === 'code' ? 'Unknown' : 'Unknown Layout';
    }

    let mainKb = keyboards.find((kb: HyprctlKeyboard) => kb.main);

    if (!mainKb) {
        mainKb = keyboards[keyboards.length - 1];
    }

    if (!isValidLayout(mainKb.active_keymap)) {
        return layoutMap['Unknown Layout'];
    }

    const layout: LayoutKeys = mainKb.active_keymap;

    const foundLayout: LayoutValues = layoutMap[layout];

    return format === 'code' ? (foundLayout ?? layout) : layout;
};

function isValidLayout(kbLayout: string): kbLayout is LayoutKeys {
    if (!Object.keys(layoutMap).includes(kbLayout)) {
        return false;
    }

    return true;
}
