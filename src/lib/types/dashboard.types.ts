import { Variable } from 'astal';

export type ShortcutVariable = {
    tooltip: Variable<string>;
    command: Variable<string>;
    icon: Variable<string>;
    configurable?: true;
};
