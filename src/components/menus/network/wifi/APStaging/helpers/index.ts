import { Variable } from 'astal';
import { Gdk } from 'astal/gtk3';
import { Entry } from 'astal/gtk3/widget';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { NetworkService } from 'src/services/network';

const networkService = NetworkService.getInstance();

export function handlePasswordInput(
    self: Entry,
    event: Gdk.Event,
    staging: Variable<AstalNetwork.AccessPoint | undefined>,
    isConnectingWithPassword: Variable<boolean>,
): void {
    const keyPressed = event.get_keyval()[1];
    const accessPoint = staging.get();
    const password = self.text;

    if (keyPressed !== Gdk.KEY_Return || password.length === 0 || !accessPoint) {
        return;
    }

    isConnectingWithPassword.set(true);

    networkService.wifi
        .connectToAPWithPassword(accessPoint, password)
        .then(() => {
            isConnectingWithPassword.set(false);
        })
        .catch(() => {
            // Error notification is already handled by WifiManager._handleConnectionError
            isConnectingWithPassword.set(false);

            if (self.is_visible() && self.get_realized()) {
                self.grab_focus();
            }

            self.text = '';
        });
}
