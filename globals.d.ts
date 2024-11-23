/* eslint-disable no-var */

import { Options, Variable as VariableType } from 'types/variable';

declare global {
    var useTheme: (filePath: string) => void;
    var getSystrayItems: () => string;
    var isWindowVisible: (windowName: string) => boolean;
    var setLayout: (layout: string) => string;
    var clearAllNotifications: () => Promise<void>;
    var setWallpaper: (filePath: string) => void;

    var globalWeatherVar: VariableType<Weather>;
    var options: Options;
    var removingNotifications: VariableType<boolean>;
}

export {};
