import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const ClockMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page clock paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Clock Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.clock.text, title: 'Text', type: 'color' }),

                Header('Card'),
                Option({ opt: options.theme.bar.menus.menu.clock.card.color, title: 'Card', type: 'color' }),

                Header('Background'),
                Option({
                    opt: options.theme.bar.menus.menu.clock.background.color,
                    title: 'Background',
                    type: 'color',
                }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.menu.clock.border.color, title: 'Border', type: 'color' }),

                Header('Time'),
                Option({ opt: options.theme.bar.menus.menu.clock.time.time, title: 'Time', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.time.timeperiod,
                    title: 'Period',
                    subtitle: 'AM/PM',
                    type: 'color',
                }),

                Header('Calendar'),
                Option({
                    opt: options.theme.bar.menus.menu.clock.calendar.yearmonth,
                    title: 'Year/Month',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.clock.calendar.weekdays, title: 'Weekdays', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.calendar.paginator,
                    title: 'Navigation Arrows (Hover)',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.calendar.currentday,
                    title: 'Current Day',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.clock.calendar.days, title: 'Days', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.calendar.contextdays,
                    title: 'Trailing/Leading Days',
                    type: 'color',
                }),

                Header('Weather'),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.icon,
                    title: 'Current Weather Icon',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.temperature,
                    title: 'Current Temperature',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.status,
                    title: 'Current Status',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.stats,
                    title: 'Current Stats',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.thermometer.extremelyhot,
                    title: 'Thermometer - Extremely Hot',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.thermometer.hot,
                    title: 'Thermometer - Hot',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.thermometer.moderate,
                    title: 'Thermometer - Moderate',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.thermometer.cold,
                    title: 'Thermometer - Cold',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.thermometer.extremelycold,
                    title: 'Thermometer - Extremely Cold',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.hourly.time,
                    title: 'Hourly Weather Time',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.hourly.icon,
                    title: 'Hourly Weather Icon',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.clock.weather.hourly.temperature,
                    title: 'Hourly Weather Temperature',
                    type: 'color',
                }),
            ],
        }),
    });
};
