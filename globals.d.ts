// globals.d.ts

import { Variable as VariableType } from "types/variable";

declare global {
    var globalMousePos: VariableType<number[]>;
    var useTheme: Function;
    var globalWeatherVar: VariableType<Weather>;
}

export { };
