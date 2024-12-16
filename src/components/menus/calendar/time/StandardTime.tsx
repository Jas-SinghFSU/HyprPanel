import options from 'src/options';
import { bind, GLib, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { systemTime } from 'src/globals/time';

const { military, hideSeconds } = options.menus.clock.time;

const period = Variable('').poll(1000, (): string => GLib.DateTime.new_now_local().format('%p') || '');

export const StandardTime = (): JSX.Element => {
    const CurrentTime = ({ hideSeconds }: CurrentTimeProps): JSX.Element => {
        return (
            <box halign={Gtk.Align.CENTER}>
                <label
                    className={'clock-content-time'}
                    label={bind(systemTime).as((time) => {
                        return time?.format(hideSeconds ? '%I:%M' : '%I:%M:%S') || '';
                    })}
                />
            </box>
        );
    };

    const CurrentPeriod = (): JSX.Element => {
        return (
            <box halign={Gtk.Align.CENTER}>
                <label className={'clock-content-period'} valign={Gtk.Align.END} label={bind(period)} />
            </box>
        );
    };

    const timeBinding = Variable.derive([bind(military), bind(hideSeconds)], (is24hr, hideSeconds) => {
        if (is24hr) {
            return <box />;
        }

        return (
            <box>
                <CurrentTime hideSeconds={hideSeconds} />
                <CurrentPeriod />
            </box>
        );
    });

    return (
        <box
            onDestroy={() => {
                timeBinding.drop();
            }}
        >
            {timeBinding()}
        </box>
    );
};

interface CurrentTimeProps {
    hideSeconds: boolean;
}
