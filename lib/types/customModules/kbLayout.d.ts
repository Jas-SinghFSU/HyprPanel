export type KbLabelType = "layout" | "code";
export type KbIcon = "" | "󰌌" | "" | "󰬴" | "󰗊";

export type HyprctlKeyboard = {
    address: string;
    name: string;
    rules: string;
    model: string;
    layout: string;
    variant: string;
    options: string;
    active_keymap: string;
    main: boolean;
};

export type HyprctlMouse = {
    address: string;
    name: string;
    defaultSpeed: number;
};

export type HyprctlDeviceLayout = {
    mice: HyprctlMouse[];
    keyboards: HyprctlKeyboard[];
    tablets: any[];
    touch: any[];
    switches: any[];
};
