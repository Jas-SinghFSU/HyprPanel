export type ShortcutFixed = {
    tooltip: string;
    command: string;
    icon: string;
    configurable: false;
};

export type ShortcutVariable = {
    tooltip: VarType<string>;
    command: VarType<string>;
    icon: VarType<string>;
    configurable?: true;
};

export type Shortcut = ShortcutFixed | ShortcutVariable;
