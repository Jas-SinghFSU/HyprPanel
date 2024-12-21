import { bind, execAsync, Variable } from 'astal';
import { App, Gdk, Gtk } from 'astal/gtk3';
import Menu from 'src/components/shared/Menu';
import MenuItem from 'src/components/shared/MenuItem';
import { hyprlandService } from 'src/lib/constants/services';
import { isRecording } from '../helpers';

const monitorList = Variable(hyprlandService?.monitors || []);

hyprlandService.connect('monitor-added', () => monitorList.set(hyprlandService.monitors));
hyprlandService.connect('monitor-removed', () => monitorList.set(hyprlandService.monitors));

const MonitorListDropdown = (): JSX.Element => {
    return (
        <Menu className={'dropdown recording'} halign={Gtk.Align.FILL} hexpand>
            {bind(monitorList).as((monitors) => {
                return monitors.map((monitor) => (
                    <MenuItem
                        label={`Display ${monitor.name}`}
                        onButtonPressEvent={(_, event) => {
                            const buttonClicked = event.get_button()[1];

                            if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                                return;
                            }

                            App.get_window('dashboardmenu')?.set_visible(false);

                            execAsync(`${SRC_DIR}/scripts/screen_record.sh start ${monitor.name}`).catch((err) =>
                                console.error(err),
                            );
                        }}
                    />
                ));
            })}
        </Menu>
    );
};

export const RecordingButton = (): JSX.Element => {
    return (
        <button
            className={`dashboard-button record ${isRecording.get() ? 'active' : ''}`}
            tooltipText={'Record Screen'}
            vexpand
            onButtonPressEvent={(_, event) => {
                const buttonClicked = event.get_button()[1];

                if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                    return;
                }

                if (isRecording.get() === true) {
                    App.get_window('dashboardmenu')?.set_visible(false);
                    return execAsync(`${SRC_DIR}/scripts/screen_record.sh stop`).catch((err) => console.error(err));
                } else {
                    const monitorDropdownList = MonitorListDropdown() as Gtk.Menu;
                    monitorDropdownList.popup_at_pointer(event);
                }
            }}
        >
            <label className={'button-label txt-icon'} label={'󰑊'} />
        </button>
    );
};
