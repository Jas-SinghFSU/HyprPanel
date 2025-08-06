import { Variable } from 'astal';
import { Gdk } from 'astal/gtk3';
import { Entry } from 'astal/gtk3/widget';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { NetworkService } from 'src/services/network';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

const networkService = NetworkService.getInstance();

export function handlePasswordInput(
    self: Entry,
    event: Gdk.Event,
    staging: Variable<AstalNetwork.AccessPoint | undefined>,
): void {
    const keyPressed = event.get_keyval()[1];
    const accessPoint = staging.get();
    const password = self.text;

    if (keyPressed !== Gdk.KEY_Return || password.length === 0 || !accessPoint) {
        return;
    }

    networkService.wifi.connectToAPWithPassword(accessPoint, password).catch((err) => {
        if (self.is_visible() && self.get_realized()) {
            self.grab_focus();
        }

        SystemUtilities.notify({
            summary: 'Network',
            body: err.message,
        });

        self.text = '';
    });
}
