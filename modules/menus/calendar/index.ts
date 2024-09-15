import DropdownMenu from '../shared/dropdown/index.js';
import { TimeWidget } from './time/index.js';
import { CalendarWidget } from './calendar.js';
import { WeatherWidget } from './weather/index.js';
import Window from 'types/widgets/window.js';
import { Attribute, Child } from 'lib/types/widget.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'calendarmenu',
        transition: 'crossfade',
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
                            children: [TimeWidget(), CalendarWidget(), WeatherWidget()],
                        }),
                    ],
                }),
            ],
        }),
    });
};
