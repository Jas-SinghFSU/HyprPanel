import {
    HyprctlDeviceLayout,
    HyprctlKeyboard,
    KbLabelType,
    LayoutKeys,
    LayoutValues,
} from 'lib/types/customModules/kbLayout';
import { layoutMap } from './layouts';

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
