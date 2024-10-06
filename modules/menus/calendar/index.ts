import DropdownMenu from 'modules/menus/shared/dropdown/index';
import { TimeWidget } from './time/index';
import { CalendarWidget } from './calendar';
import { WeatherWidget } from './weather/index';
import options from 'options';
import Window from 'types/widgets/window';
import { Attribute, Child } from 'lib/types/widget';

const { enabled: weatherEnabled } = options.menus.clock.weather;

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'calendarmenu',
        transition: options.menus.transition.bind('value'),
        child: Widget.Box({
            class_name: 'calendar-menu-content',
            css: 'padding: 1px; margin: -1px;',
            vexpand: false,
            children: [
                Widget.Box({
                    class_name: 'calendar-content-container',
                    vertical: true,
                    children: [
                        Widget.Box({
                            class_name: 'calendar-content-items',
                            vertical: true,
                            children: weatherEnabled.bind('value').as((isWeatherEnabled) => {
                                return [TimeWidget(), CalendarWidget(), ...(isWeatherEnabled ? [WeatherWidget()] : [])];
                            }),
                        }),
                    ],
                }),
            ],
        }),
    });
};
