import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import { weatherIcons } from 'src/lib/constants/weather.js';
import { getIconQuery } from '../helpers';
import WeatherManager from 'src/services/weather';

const weatherManager = WeatherManager.get_default();

export const HourlyIcon = ({ hoursFromNow }: HourlyIconProps): JSX.Element => {
    return (
        <box halign={Gtk.Align.CENTER}>
            <label
                className={'hourly-weather-icon txt-icon'}
                label={bind(weatherManager.weatherData).as((weather) => {
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
