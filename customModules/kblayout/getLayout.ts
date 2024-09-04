import { HyprctlDeviceLayout, HyprctlKeyboard, KbLabelType } from "lib/types/customModules/kbLayout";
import { layoutMap } from "./layouts";

export const getKeyboardLayout = (obj: string, format: KbLabelType) => {
    let hyprctlDevices: HyprctlDeviceLayout = JSON.parse(obj);
    let keyboards = hyprctlDevices['keyboards'];

    if (keyboards.length === 0) {
        return "No KB!"
    }

    let mainKb = keyboards.find((kb: HyprctlKeyboard) => kb.main);

    if (!mainKb) {
        mainKb = keyboards[keyboards.length - 1];
    }

    let layout = mainKb['active_keymap'];

    return format === "code" ? layoutMap[layout] || layout : layout;
}
