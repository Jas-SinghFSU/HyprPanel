import { bind } from 'astal';
import { globalWeatherVar } from 'src/globals/weather';
import { Gtk } from 'astal/gtk3';
import { weatherIcons } from 'src/lib/icons/weather.js';
import { getIconQuery } from '../helpers';

export const HourlyIcon = ({ hoursFromNow }: HourlyIconProps): JSX.Element => {
    return (
        <box halign={Gtk.Align.CENTER}>
            <label
                className={'hourly-weather-icon txt-icon'}
                label={bind(globalWeatherVar).as((weather) => {
                    const iconQuery = getIconQuery(weather, hoursFromNow);
                    const weatherIcn = weatherIcons[iconQuery] || weatherIcons['warning'];
                    return weatherIcn;
                })}
                halign={Gtk.Align.CENTER}
            />
        </box>
    );
};

interface HourlyIconProps {
    hoursFromNow: number;
}
