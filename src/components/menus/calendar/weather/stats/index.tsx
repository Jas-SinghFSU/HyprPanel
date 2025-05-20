import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';
import WeatherManager from 'src/services/weather';
import options from 'src/configuration';

const weatherManager = WeatherManager.get_default();

const { unit } = options.menus.clock.weather;

export const TodayStats = (): JSX.Element => {
    const windBindings = Variable.derive(
        [bind(weatherManager.weatherData), bind(unit)],
        weatherManager.getWindConditions,
    );

    return (
        <box
            className={'calendar-menu-weather today stats container'}
            halign={Gtk.Align.END}
            valign={Gtk.Align.CENTER}
            vertical
            onDestroy={() => {
                windBindings.drop();
            }}
        >
            <box className={'weather wind'}>
                <label className={'weather wind icon txt-icon'} label={''} />
                <label className={'weather wind label'} label={windBindings()} />
            </box>
            <box className={'weather precip'}>
                <label className={'weather precip icon txt-icon'} label={''} />
                <label
                    className={'weather precip label'}
                    label={bind(weatherManager.weatherData).as(weatherManager.getRainChance)}
                />
            </box>
        </box>
    );
};
