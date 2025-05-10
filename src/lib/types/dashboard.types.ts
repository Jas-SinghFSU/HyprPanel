import { Variable } from 'astal';

export type ShortcutFixed = {
    tooltip: string;
    command: string;
    icon: string;
    configurable: false;
};

export type ShortcutVariable = {
    tooltip: Variable<string>;
    command: Variable<string>;
    icon: Variable<string>;
    configurable?: true;
};

export type Shortcut = ShortcutFixed | ShortcutVariable;
