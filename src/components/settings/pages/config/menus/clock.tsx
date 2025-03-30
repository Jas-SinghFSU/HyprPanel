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
            </box>
        </scrollable>
    );
};
