import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';
import WeatherService from 'src/services/weather';
import options from 'src/configuration';

const weatherService = WeatherService.get_default();
const { unit } = options.menus.clock.weather;

const WeatherStatus = (): JSX.Element => {
    return (
        <box halign={Gtk.Align.CENTER}>
            <label
                className={bind(weatherService.weatherData).as(
                    (weather) =>
                        `calendar-menu-weather today condition label ${weatherService.getWeatherIcon(Math.ceil(weather.current.temp_f)).color}`,
                )}
                label={bind(weatherService.weatherData).as((weather) => weather.current.condition.text)}
                truncate
                tooltipText={bind(weatherService.weatherData).as((weather) => weather.current.condition.text)}
            />
        </box>
    );
};

const Temperature = (): JSX.Element => {
    const labelBinding = Variable.derive(
        [bind(weatherService.weatherData), bind(unit)],
        weatherService.getTemperature,
    );

    const TemperatureLabel = (): JSX.Element => {
        return <label className={'calendar-menu-weather today temp label'} label={labelBinding()} />;
    };

    const ThermometerIcon = (): JSX.Element => {
        return (
            <label
                className={bind(weatherService.weatherData).as(
                    (weather) =>
                        `calendar-menu-weather today temp label icon txt-icon ${weatherService.getWeatherIcon(Math.ceil(weather.current.temp_f)).color}`,
                )}
                label={bind(weatherService.weatherData).as(
                    (weather) => weatherService.getWeatherIcon(Math.ceil(weather.current.temp_f)).icon,
                )}
            />
        );
    };

    return (
        <box
            className={'calendar-menu-weather today temp container'}
            valign={Gtk.Align.CENTER}
            vertical={false}
            onDestroy={() => {
                labelBinding.drop();
            }}
            hexpand
        >
            <box halign={Gtk.Align.CENTER} hexpand>
                <TemperatureLabel />
                <ThermometerIcon />
            </box>
        </box>
    );
};

export const TodayTemperature = (): JSX.Element => {
    return (
        <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} vertical>
            <Temperature />
            <WeatherStatus />
        </box>
    );
};
