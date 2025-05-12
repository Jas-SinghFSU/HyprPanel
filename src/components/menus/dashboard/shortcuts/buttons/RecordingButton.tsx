import { bind, Variable } from 'astal';
import { App, Gdk, Gtk } from 'astal/gtk3';
import Menu from 'src/components/shared/Menu';
import MenuItem from 'src/components/shared/MenuItem';
import { isRecording, getRecordingPath, executeCommand } from '../helpers';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

const hyprlandService = AstalHyprland.get_default();

const MonitorListDropdown = (): JSX.Element => {
    const monitorList: Variable<AstalHyprland.Monitor[]> = Variable([]);

    const monitorBinding = Variable.derive([bind(hyprlandService, 'monitors')], () => {
        monitorList.set(hyprlandService.get_monitors());
    });

    return (
        <Menu
            className={'dropdown recording'}
            halign={Gtk.Align.FILL}
            onDestroy={() => monitorBinding.drop()}
            hexpand
        >
            {bind(monitorList).as((monitors) =>
                monitors.map((monitor) => {
                    const sanitizedPath = getRecordingPath().replace(/"/g, '\\"');

                    return (
                        <MenuItem
                            label={`Display ${monitor.name}`}
                            onButtonPressEvent={(_, event) => {
                                if (event.get_button()[1] !== Gdk.BUTTON_PRIMARY) return;

                                App.get_window('dashboardmenu')?.set_visible(false);

                                const command = `${SRC_DIR}/scripts/screen_record.sh start screen "${monitor.name}" "${sanitizedPath}"`;
                                executeCommand(command);
                            }}
                        />
                    );
                }),
            )}
            <MenuItem
                label="Region"
                onButtonPressEvent={(_, event) => {
                    if (event.get_button()[1] !== Gdk.BUTTON_PRIMARY) return;

                    App.get_window('dashboardmenu')?.set_visible(false);

                    const sanitizedPath = getRecordingPath().replace(/"/g, '\\"');
                    const command = `${SRC_DIR}/scripts/screen_record.sh start region "${sanitizedPath}"`;
                    executeCommand(command);
                }}
            />
        </Menu>
    );
};

export const RecordingButton = (): JSX.Element => {
    return (
        <button
            className={`dashboard-button record ${isRecording.get() ? 'active' : ''}`}
            tooltipText="Record Screen"
            vexpand
            onButtonPressEvent={(_, event) => {
                const buttonClicked = event.get_button()[1];

                if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                    return;
                }

                const sanitizedPath = getRecordingPath().replace(/"/g, '\\"');

                if (isRecording.get() === true) {
                    App.get_window('dashboardmenu')?.set_visible(false);
                    const command = `${SRC_DIR}/scripts/screen_record.sh stop "${sanitizedPath}"`;
                    executeCommand(command);
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
