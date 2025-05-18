import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import WeatherManager from 'src/services/weather';

const weatherManager = WeatherManager.get_default();

export const TodayIcon = (): JSX.Element => {
    return (
        <box
            className={'calendar-menu-weather today icon container'}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
        >
            <label
                className={'calendar-menu-weather today icon txt-icon'}
                label={bind(weatherManager.weatherData).as((weather) =>
                    weatherManager.getWeatherStatusTextIcon(weather),
                )}
            />
        </box>
    );
};
