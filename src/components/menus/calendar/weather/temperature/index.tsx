import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';
import WeatherService from 'src/services/weather';
import { toTitleCase } from 'src/lib/string/formatters';

const weatherService = WeatherService.getInstance();

const WeatherStatus = (): JSX.Element => {
    return (
        <box halign={Gtk.Align.CENTER}>
            <label
                className={bind(weatherService.gaugeIcon).as(
                    (gauge) => `calendar-menu-weather today condition label ${gauge.color}`,
                )}
                label={bind(weatherService.weatherData).as((weather) =>
                    toTitleCase(weather.current.condition.text),
                )}
                truncate
                tooltipText={bind(weatherService.weatherData).as((weather) => weather.current.condition.text)}
            />
        </box>
    );
};

const Temperature = (): JSX.Element => {
    const TemperatureLabel = (): JSX.Element => {
        return (
            <label
                className={'calendar-menu-weather today temp label'}
                label={bind(weatherService.temperature)}
            />
        );
    };

    const ThermometerIcon = (): JSX.Element => {
        return (
            <label
                className={bind(weatherService.gaugeIcon).as(
                    (gauge) => `calendar-menu-weather today temp label icon txt-icon ${gauge.color}`,
                )}
                label={bind(weatherService.gaugeIcon).as((gauge) => gauge.icon)}
            />
        );
    };

    return (
        <box
            className={'calendar-menu-weather today temp container'}
            valign={Gtk.Align.CENTER}
            vertical={false}
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
