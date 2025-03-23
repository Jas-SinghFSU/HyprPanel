import { bind, execAsync, Variable } from 'astal';
import { App, Gdk, Gtk } from 'astal/gtk3';
import Menu from 'src/components/shared/Menu';
import MenuItem from 'src/components/shared/MenuItem';
import { isRecording } from '../helpers';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import options from 'src/options';

const hyprlandService = AstalHyprland.get_default();

// Function to get the latest recording path
const getRecordingPath = (): string => options.menus.dashboard.recording.path.get();

// Execute shell commands safely with path expansion
const executeCommand = async (command: string): Promise<void> => {
    try {
        await execAsync(`/bin/bash -c '${command}'`);
    } catch (err) {
        console.error('Command failed:', command);
        console.error('Error:', err);
    }
};

// Monitor dropdown for screen selection
const MonitorListDropdown = (): JSX.Element => {
    const monitorList: Variable<AstalHyprland.Monitor[]> = Variable([]);

    const monitorBinding = Variable.derive([bind(hyprlandService, 'monitors')], () => {
        monitorList.set(hyprlandService.get_monitors());
    });

    return (
        <Menu className="dropdown recording" halign={Gtk.Align.FILL} onDestroy={() => monitorBinding.drop()} hexpand>
            {bind(monitorList).as((monitors) => {
                return monitors.map((monitor) => {
                    const sanitizedPath = getRecordingPath().replace(/"/g, '\\"');

                    return (
                        <MenuItem
                            label={`Display ${monitor.name}`}
                            onButtonPressEvent={(_, event) => {
                                if (event.get_button()[1] !== Gdk.BUTTON_PRIMARY) return;

                                App.get_window('dashboardmenu')?.set_visible(false);

                                // Update command to match new script argument order
                                const command = `${SRC_DIR}/scripts/screen_record.sh start screen "${monitor.name}" "${sanitizedPath}"`;
                                executeCommand(command);
                            }}
                        />
                    );
                });
            })}
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

// Recording button to start/stop screen recording
export const RecordingButton = (): JSX.Element => {
    return (
        <button
            className={`dashboard-button record ${isRecording.get() ? 'active' : ''}`}
            tooltipText="Record Screen"
            vexpand
            onButtonPressEvent={(_, event) => {
                if (event.get_button()[1] !== Gdk.BUTTON_PRIMARY) return;

                const sanitizedPath = getRecordingPath().replace(/"/g, '\\"');

                if (isRecording.get()) {
                    App.get_window('dashboardmenu')?.set_visible(false);
                    const command = `${SRC_DIR}/scripts/screen_record.sh stop "${sanitizedPath}"`;
                    executeCommand(command);
                } else {
                    const monitorDropdownList = MonitorListDropdown() as Gtk.Menu;
                    monitorDropdownList.popup_at_pointer(event);
                }
            }}
        >
            <label className="button-label txt-icon" label="󰑊" />
        </button>
    );
};
