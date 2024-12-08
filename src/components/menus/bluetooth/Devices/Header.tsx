import { bind, timeout } from 'astal';
import { Gdk, Gtk } from 'astal/gtk3';
import Separator from 'src/components/shared/Separator';
import { bluetoothService } from 'src/lib/constants/services';
import { isPrimaryClick } from 'src/lib/utils';

export const Header = (): JSX.Element => {
    const MenuLabel = (): JSX.Element => {
        return <label className="menu-label" valign={Gtk.Align.CENTER} halign={Gtk.Align.START} label="Bluetooth" />;
    };

    const Controls = (): JSX.Element => {
        const ToggleSwitch = (): JSX.Element => (
            <switch
                className="menu-switch bluetooth"
                hexpand
                halign={Gtk.Align.END}
                active={bind(bluetoothService, 'isPowered')}
                onButtonPressEvent={(_, event) => {
                    const buttonClicked = event.get_button()[1];
                    if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                        return;
                    }

                    if (bluetoothService.adapter.powered) {
                        bluetoothService.adapter.set_powered(false);
                    } else {
                        bluetoothService.adapter.set_powered(true);
                    }
                }}
            />
        );

        const DiscoverButton = (): JSX.Element => (
            <button
                className="menu-icon-button search"
                valign={Gtk.Align.CENTER}
                onClick={(_, self) => {
                    if (!isPrimaryClick(self)) {
                        return;
                    }

                    if (bluetoothService.adapter.discovering) {
                        return bluetoothService.adapter.stop_discovery();
                    }

                    bluetoothService.adapter.start_discovery();

                    const discoveryTimeout = 12000;
                    timeout(discoveryTimeout, () => {
                        if (bluetoothService.adapter.discovering) {
                            bluetoothService.adapter.stop_discovery();
                        }
                    });
                }}
            >
                <icon
                    className={bind(bluetoothService.adapter, 'discovering').as((isDiscovering) =>
                        isDiscovering ? 'spinning-icon' : '',
                    )}
                    icon="view-refresh-symbolic"
                />
            </button>
        );

        return (
            <box className="controls-container" valign={Gtk.Align.START}>
                <ToggleSwitch />
                <Separator className="menu-separator bluetooth" />
                <DiscoverButton />
            </box>
        );
    };
    return (
        <box className="menu-label-container" halign={Gtk.Align.FILL} valign={Gtk.Align.START}>
            <MenuLabel />
            <Controls />
        </box>
    );
};
