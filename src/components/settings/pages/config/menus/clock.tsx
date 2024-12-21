import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const ClockMenuSettings = (): JSX.Element => {
    return (
        <scrollable name={'Clock Menu'} vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box className="bar-theme-page paged-container" vertical>
                <Header title="Time" />
                <Option opt={options.menus.clock.time.military} title="Use 24hr time" type="boolean" />
                <Option opt={options.menus.clock.time.hideSeconds} title="Hide seconds" type="boolean" />

                <Header title="Weather" />
                <Option opt={options.menus.clock.weather.enabled} title="Enabled" type="boolean" />
                <Option
                    opt={options.menus.clock.weather.location}
                    title="Location"
                    subtitle="Zip Code, Postal Code, City, etc."
                    type="string"
                />
                <Option
                    opt={options.menus.clock.weather.key}
                    title="Weather API Key"
                    subtitle="API Key or path to JSON file containing 'weather_api_key'"
                    type="string"
                />
                <Option
                    opt={options.menus.clock.weather.unit}
                    title="Units"
                    type="enum"
                    enums={['imperial', 'metric']}
                />
                <Option
                    opt={options.menus.clock.weather.interval}
                    title="Weather Fetching Interval (ms)"
                    subtitle="May require AGS restart."
                    type="number"
                />
            </box>
        </scrollable>
    );
};
