import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import options from '../../configuration';

const hyprlandService = AstalHyprland.get_default();
const notifdService = AstalNotifd.get_default();

export const enableDoNotDisturbOnScrenshare = (): void => {
    let signalId: number | undefined = undefined;

    const connect = (): void => {
        disconnect();
        signalId = hyprlandService.connect('event', (_, event, bar) => {
            if (event !== 'screencast') {
                return;
            }

            const [isTurnedOn] = bar.split(',');

            if (isTurnedOn === '0') {
                notifdService.set_dont_disturb(false);
            }

            if (isTurnedOn === '1') {
                notifdService.set_dont_disturb(true);
            }
        });
    };

    const disconnect = (): void => {
        if (signalId !== undefined) {
            hyprlandService.disconnect(signalId);
            signalId = undefined;
        }
    };

    const enabled = options.notifications.dndOnScreencast.get();

    if (enabled) {
        connect();
    }

    options.notifications.dndOnScreencast.subscribe((value) => {
        if (value) {
            connect();
        } else {
            disconnect();
        }
    });
};
