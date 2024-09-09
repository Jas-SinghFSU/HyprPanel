// globals.d.ts

import { Options, Variable as VariableType } from "types/variable";

declare global {
    var globalMousePos: VariableType<number[]>;
    var useTheme: Function;
    var globalWeatherVar: VariableType<Weather>;
    var options: Options
}

export { };
