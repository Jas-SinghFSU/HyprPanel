import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';
import WeatherService from 'src/services/weather';

const weatherService = WeatherService.getInstance();

export const TodayStats = (): JSX.Element => {
    return (
        <box
            className={'calendar-menu-weather today stats container'}
            halign={Gtk.Align.END}
            valign={Gtk.Align.CENTER}
            vertical
        >
            <box className={'weather wind'}>
                <label className={'weather wind icon txt-icon'} label={''} />
                <label className={'weather wind label'} label={bind(weatherService.windCondition)} />
            </box>
            <box className={'weather precip'}>
                <label className={'weather precip icon txt-icon'} label={''} />
                <label
                    className={'weather precip label'}
                    label={bind(weatherService.rainChance).as((chanceOfRain) => `${chanceOfRain}%`)}
                />
            </box>
        </box>
    );
};
