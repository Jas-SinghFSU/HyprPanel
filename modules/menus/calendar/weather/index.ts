import { TodayIcon } from './icon/index.js';
import { TodayStats } from './stats/index.js';
import { TodayTemperature } from './temperature/index.js';
import { Hourly } from './hourly/index.js';
import { globalWeatherVar } from 'globals/weather.js';
import { BoxWidget } from 'lib/types/widget.js';

const WeatherWidget = (): BoxWidget => {
    return Widget.Box({
        class_name: 'calendar-menu-item-container weather',
        child: Widget.Box({
            class_name: 'weather-container-box',
            setup: (self) => {
                return (self.child = Widget.Box({
                    vertical: true,
                    hexpand: true,
                    children: [
                        Widget.Box({
                            class_name: 'calendar-menu-weather today',
                            hexpand: true,
                            children: [
                                TodayIcon(globalWeatherVar),
                                TodayTemperature(globalWeatherVar),
                                TodayStats(globalWeatherVar),
                            ],
                        }),
                        Widget.Separator({
                            class_name: 'menu-separator weather',
                        }),
                        Hourly(globalWeatherVar),
                    ],
                }));
            },
        }),
    });
};

export { WeatherWidget };
