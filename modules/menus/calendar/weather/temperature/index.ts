import { Weather } from 'lib/types/weather';
import { Variable } from 'types/variable';
import options from 'options';
import { getTemperature, getWeatherIcon } from 'globals/weather';
import { BoxWidget } from 'lib/types/widget';
const { unit } = options.menus.clock.weather;

export const TodayTemperature = (theWeather: Variable<Weather>): BoxWidget => {
    return Widget.Box({
        hpack: 'center',
        vpack: 'center',
        vertical: true,
        children: [
            Widget.Box({
                hexpand: true,
                vpack: 'center',
                class_name: 'calendar-menu-weather today temp container',
                vertical: false,
                children: [
                    Widget.Box({
                        hexpand: true,
                        hpack: 'center',
                        children: [
                            Widget.Label({
                                class_name: 'calendar-menu-weather today temp label',
                                label: Utils.merge([theWeather.bind('value'), unit.bind('value')], (wthr, unt) => {
                                    return getTemperature(wthr, unt);
                                }),
                            }),
                            Widget.Label({
                                class_name: theWeather
                                    .bind('value')
                                    .as(
                                        (v) =>
                                            `calendar-menu-weather today temp label icon txt-icon ${getWeatherIcon(Math.ceil(v.current.temp_f)).color}`,
                                    ),
                                label: theWeather
                                    .bind('value')
                                    .as((v) => getWeatherIcon(Math.ceil(v.current.temp_f)).icon),
                            }),
                        ],
                    }),
                ],
            }),
            Widget.Box({
                hpack: 'center',
                child: Widget.Label({
                    max_width_chars: 17,
                    truncate: 'end',
                    lines: 2,
                    class_name: theWeather
                        .bind('value')
                        .as(
                            (v) =>
                                `calendar-menu-weather today condition label ${getWeatherIcon(Math.ceil(v.current.temp_f)).color}`,
                        ),
                    label: theWeather.bind('value').as((v) => v.current.condition.text),
                }),
            }),
        ],
    });
};
