import options from 'src/options';
import { globalWeatherVar } from 'src/globals/weather';
import { getTemperature, getWeatherIcon } from 'src/globals/weather';
import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';
const { unit } = options.menus.clock.weather;

const WeatherStatus = (): JSX.Element => {
    return (
        <box halign={Gtk.Align.CENTER}>
            <label
                className={bind(globalWeatherVar).as(
                    (weather) =>
                        `calendar-menu-weather today condition label ${getWeatherIcon(Math.ceil(weather.current.temp_f)).color}`,
                )}
                label={bind(globalWeatherVar).as((weather) => weather.current.condition.text)}
                truncate
                tooltipText={bind(globalWeatherVar).as((weather) => weather.current.condition.text)}
            />
        </box>
    );
};

const Temperature = (): JSX.Element => {
    const labelBinding = Variable.derive([bind(globalWeatherVar), bind(unit)], getTemperature);

    const TemperatureLabel = (): JSX.Element => {
        return <label className={'calendar-menu-weather today temp label'} label={labelBinding()} />;
    };

    const ThermometerIcon = (): JSX.Element => {
        return (
            <label
                className={bind(globalWeatherVar).as(
                    (weather) =>
                        `calendar-menu-weather today temp label icon txt-icon ${getWeatherIcon(Math.ceil(weather.current.temp_f)).color}`,
                )}
                label={bind(globalWeatherVar).as((weather) => getWeatherIcon(Math.ceil(weather.current.temp_f)).icon)}
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
