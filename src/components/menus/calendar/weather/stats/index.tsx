import { getTemperature, globalWeatherVar } from 'src/globals/weather';
import options from 'src/options';
import { getRainChance } from 'src/globals/weather';
import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';

const { unit } = options.menus.clock.weather;

export const TodayStats = (): JSX.Element => {
    const temperatureBinding = Variable.derive([bind(globalWeatherVar), bind(unit)], getTemperature);

    return (
        <box
            className={'calendar-menu-weather today stats container'}
            halign={Gtk.Align.END}
            valign={Gtk.Align.CENTER}
            vertical
            onDestroy={() => {
                temperatureBinding.drop();
            }}
        >
            <box className={'weather wind'}>
                <label className={'weather wind icon txt-icon'} label={''} />
                <label className={'weather wind label'} label={temperatureBinding()} />
            </box>
            <box className={'weather precip'}>
                <label className={'weather precip icon txt-icon'} label={''} />
                <label className={'weather precip label'} label={bind(globalWeatherVar).as(getRainChance)} />
            </box>
        </box>
    );
};
