import { Gdk, Gtk } from 'astal/gtk3';

export const NoWifi = (): JSX.Element => {
    return (
        <box className="menu-section-container wifi" vertical>
            <box className="menu-label-container" halign={Gtk.Align.FILL}>
                <label className="menu-label" halign={Gtk.Align.START} hexpand label="Wi-Fi" />
                <switch
                    className="menu-switch network"
                    valign={Gtk.Align.CENTER}
                    tooltipText="Toggle Wifi"
                    onButtonPressEvent={(self, event) => {
                        const buttonClicked = event.get_button()[1];

                        if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                            return;
                        }
                    }}
                    sensitive={false}
                    active={false}
                />
                <button
                    className="menu-icon-button search network"
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.END}
                    sensitive={false}
                >
                    <icon icon="view-refresh-symbolic" />
                </button>
            </box>

            <box className="menu-items-section" vertical>
                <label
                    className="waps-not-found dim"
                    expand
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                    label="Wi-Fi Adapter Not Found"
                />
            </box>
        </box>
    );
};
