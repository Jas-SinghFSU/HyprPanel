import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';
import WeatherService from 'src/services/weather';
import options from 'src/configuration';

const weatherService = WeatherService.getInstance();

const { unit } = options.menus.clock.weather;

export const TodayStats = (): JSX.Element => {
    const windBindings = Variable.derive(
        [bind(weatherService.weatherData), bind(unit)],
        weatherService.getWindConditions,
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
                    label={bind(weatherService.weatherData).as(weatherService.getRainChance)}
                />
            </box>
        </box>
    );
};
