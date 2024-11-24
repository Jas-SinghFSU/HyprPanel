import { Weather } from 'src/lib/types/weather.js';
import { Variable } from 'types/variable';
import { HourlyIcon } from './icon/index.js';
import { HourlyTemp } from './temperature/index.js';
import { HourlyTime } from './time/index.js';
import { BoxWidget } from 'src/lib/types/widget.js';

export const Hourly = (theWeather: Variable<Weather>): BoxWidget => {
    return Widget.Box({
        vertical: false,
        hexpand: true,
        hpack: 'fill',
        class_name: 'hourly-weather-container',
        children: [1, 2, 3, 4].map((hoursFromNow) => {
            return Widget.Box({
                class_name: 'hourly-weather-item',
                hexpand: true,
                vertical: true,
                children: [
                    HourlyTime(theWeather, hoursFromNow),
                    HourlyIcon(theWeather, hoursFromNow),
                    HourlyTemp(theWeather, hoursFromNow),
                ],
            });
        }),
    });
};
