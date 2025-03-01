/* eslint-disable no-var */

import { Variable } from 'astal';
import { BarLayouts } from 'src/lib/types/options';
import { Options } from 'types/variable';

declare global {
    var useTheme: (filePath: string) => void;
    var getSystrayItems: () => string;
    var isWindowVisible: (windowName: string) => boolean;
    var setLayout: (layout: BarLayouts) => string;
    var clearAllNotifications: () => Promise<void>;
    var setWallpaper: (filePath: string) => void;

    var globalWeatherVar: Variable<Weather>;
    var options: Options;
    var removingNotifications: Variable<boolean>;
    var idleInhibit: Variable<boolean>;
}

export {};
