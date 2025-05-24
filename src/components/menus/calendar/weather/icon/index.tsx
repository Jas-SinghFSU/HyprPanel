import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import WeatherService from 'src/services/weather';
import { getWeatherIcon } from 'src/services/weather/mappers';

const weatherService = WeatherService.getInstance();

export const TodayIcon = (): JSX.Element => {
    return (
        <box
            className={'calendar-menu-weather today icon container'}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
        >
            <label
                className={'calendar-menu-weather today icon txt-icon'}
                label={bind(weatherService.weatherData).as((weather) =>
                    getWeatherIcon(weather.current.condition),
                )}
            />
        </box>
    );
};
