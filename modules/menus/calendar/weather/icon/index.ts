import { Weather } from 'lib/types/weather';
import { Variable } from 'types/variable';
import { getWeatherStatusTextIcon } from 'globals/weather.js';
import { BoxWidget } from 'lib/types/widget';

export const TodayIcon = (theWeather: Variable<Weather>): BoxWidget => {
    return Widget.Box({
        vpack: 'center',
        hpack: 'start',
        class_name: 'calendar-menu-weather today icon container',
        child: Widget.Label({
            class_name: 'calendar-menu-weather today icon txt-icon',
            label: theWeather.bind('value').as((w) => {
                return getWeatherStatusTextIcon(w);
            }),
        }),
    });
};
