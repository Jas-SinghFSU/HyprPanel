import loginSession from 'greeter/services/loginSession';
import { GtkWidget } from 'lib/types/widget';

export const sessionButton = (): GtkWidget => {
    const sessionMenu = Widget.Menu({
        hpack: 'center',
        vpack: 'center',
        className: 'sessionMenu',
        children: loginSession.getSessions().map((sesh) => {
            return Widget.MenuItem({
                className: 'sessionMenuItem',
                label: sesh[0],
                onActivate: () => {
                    loginSession.currentSession.value = sesh;
                },
            });
        }),
    });

    return Widget.Button({
        className: 'sessionsButton',
        expand: true,
        child: Widget.Box({
            hpack: 'fill',
            expand: true,
            children: [
                Widget.Label({
                    className: 'sessionButtonLabel',
                    label: loginSession.currentSession.bind('value').as((sesh) => sesh[0] || 'Unknown'),
                    hpack: 'start',
                    hexpand: true,
                }),
                Widget.Label({
                    className: 'sessionButtonIcon',
                    label: '',
                    hpack: 'end',
                }),
            ],
        }),
        onPrimaryClick: (_, event) => {
            sessionMenu.popup_at_pointer(event);
        },
    });
};
