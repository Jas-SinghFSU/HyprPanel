// globals.d.ts
/* eslint-disable no-var */

import { Options, Variable as VariableType } from 'types/variable';

declare global {
    var globalMousePos: VariableType<number[]>;
    var useTheme: (filePath: string) => void;
    var globalWeatherVar: VariableType<Weather>;
    var options: Options;
    var removingNotifications: VariableType<boolean>;
}

export {};
