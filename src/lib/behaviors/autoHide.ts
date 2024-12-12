import { bind, Variable } from '../../../../../../../usr/share/astal/gjs';
import { hyprlandService } from '../constants/services';
import { App } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { forceUpdater } from 'src/components/bar/modules/workspaces/helpers';
import options from 'src/options';

const { autoHide } = options.bar;

let currentFocusedClient: Variable<void>;

const focusedClient = (focusedClient: AstalHyprland.Client): void => {
    if (currentFocusedClient) {
        currentFocusedClient();
        currentFocusedClient.drop();
    }

    const fullscreenBinding = bind(focusedClient, 'fullscreen');

    if (!focusedClient) {
        return;
    }

    currentFocusedClient = Variable.derive([bind(fullscreenBinding)], (isFullScreen) => {
        if (autoHide.get() === 'fullscreen') {
            App.get_window(`bar-${focusedClient.monitor.id}`)?.set_visible(!isFullScreen);
        }
    });
};

Variable.derive([bind(hyprlandService, 'focusedClient')], (currentClient) => {
    focusedClient(currentClient);
});

Variable.derive([bind(forceUpdater), bind(hyprlandService, 'workspaces')], () => {
    hyprlandService.workspaces.map((workspace) => {
        if (autoHide.get() === 'single-window') {
            App.get_window(`bar-${workspace.monitor.id}`)?.set_visible(workspace.clients.length !== 1);
        }
    });
});
