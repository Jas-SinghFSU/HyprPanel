import { Weather } from 'lib/types/weather';
import { Variable } from 'types/variable';
import options from 'options';
import { Unit } from 'lib/types/options';
import { getRainChance, getWindConditions } from 'globals/weather';
import { BoxWidget } from 'lib/types/widget';

const { unit } = options.menus.clock.weather;

export const TodayStats = (theWeather: Variable<Weather>): BoxWidget => {
    return Widget.Box({
        class_name: 'calendar-menu-weather today stats container',
        hpack: 'end',
        vpack: 'center',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'weather wind',
                children: [
                    Widget.Label({
                        class_name: 'weather wind icon txt-icon',
                        label: '',
                    }),
                    Widget.Label({
                        class_name: 'weather wind label',
                        label: Utils.merge(
                            [theWeather.bind('value'), unit.bind('value')],
                            (wthr: Weather, unt: Unit) => {
                                return getWindConditions(wthr, unt);
                            },
                        ),
                    }),
                ],
            }),
            Widget.Box({
                class_name: 'weather precip',
                children: [
                    Widget.Label({
                        class_name: 'weather precip icon txt-icon',
                        label: '',
                    }),
                    Widget.Label({
                        class_name: 'weather precip label',
                        label: theWeather.bind('value').as((v) => getRainChance(v)),
                    }),
                ],
            }),
        ],
    });
};
