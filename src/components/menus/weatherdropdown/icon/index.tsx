import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import { getWeatherStatusTextIcon } from 'src/globals/weather.js';

export const TodayIcon = (): JSX.Element => {
    return (
        <box
            className={'calendar-menu-weather today icon container'}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
        >
            <label
                className={'calendar-menu-weather today icon txt-icon'}
                label={bind(globalWeatherVar).as(getWeatherStatusTextIcon)}
            />
        </box>
    );
};
