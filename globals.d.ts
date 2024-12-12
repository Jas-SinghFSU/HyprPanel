/* eslint-disable no-var */

import { Variable } from 'astal';
import { Options } from 'types/variable';

declare global {
    var useTheme: (filePath: string) => void;
    var getSystrayItems: () => string;
    var isWindowVisible: (windowName: string) => boolean;
    var setLayout: (layout: string) => string;
    var clearAllNotifications: () => Promise<void>;
    var setWallpaper: (filePath: string) => void;

    var globalWeatherVar: Variable<Weather>;
    var options: Options;
    var removingNotifications: Variable<boolean>;
}

export {};
