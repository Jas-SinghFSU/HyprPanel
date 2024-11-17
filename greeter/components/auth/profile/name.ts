import loginSession from 'greeter/services/loginSession';
import Gtk30 from 'gi://Gtk?version=3.0';

const hoveringName = Variable(false);

export const profileName = (): Gtk30.Widget => {
    return Widget.EventBox({
        expand: true,
        onHover: () => (hoveringName.value = true),
        onHoverLost: () => (hoveringName.value = false),
        child: Widget.Box({
            className: 'profileNameContainer',
            children: [
                Widget.Button({
                    className: 'left navigator',
                    label: hoveringName.bind('value').as((hovering) => (hovering ? '' : '')),
                    expand: true,
                    hpack: 'start',
                    vpack: 'center',
                }),
                Widget.Label({
                    className: 'profileName',
                    expand: false,
                    hpack: 'center',
                    vpack: 'center',
                    label: loginSession.userName.value,
                }),
                Widget.Button({
                    className: 'right navigator',
                    expand: true,
                    hpack: 'end',
                    vpack: 'center',
                    label: hoveringName.bind('value').as((hovering) => (hovering ? '' : '')),
                }),
            ],
        }),
    });
};
