import { bind, Variable } from 'astal';
import { hyprlandService } from '../constants/services';
import { App } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { forceUpdater } from 'src/components/bar/modules/workspaces/helpers';
import options from 'src/options';

const { autoHide } = options.bar;

const focusedClient = (focusedClient: AstalHyprland.Client): void => {
    const fullscreenBinding = bind(focusedClient, 'fullscreen');

    if (!focusedClient) {
        return;
    }

    Variable.derive([bind(fullscreenBinding)], (isFullScreen) => {
        if (autoHide.get() === 'fullscreen') {
            App.get_window(`bar-${focusedClient.monitor.id}`)?.set_visible(!isFullScreen);
        }
    });
};

export const initializeAutoHide = (): void => {
    Variable.derive([bind(autoHide), bind(forceUpdater), bind(hyprlandService, 'workspaces')], (shouldAutohide) => {
        if (shouldAutohide === 'never') {
            hyprlandService.monitors.forEach((monitor) => {
                App.get_window(`bar-${monitor.id}`)?.set_visible(true);
            });
        }

        hyprlandService.workspaces.map((workspace) => {
            if (autoHide.get() === 'single-window') {
                App.get_window(`bar-${workspace.monitor.id}`)?.set_visible(workspace.clients.length !== 1);
            }
        });
    });

    Variable.derive([bind(hyprlandService, 'focusedClient')], (currentClient) => {
        focusedClient(currentClient);
    });

    Variable.derive([bind(autoHide)], (shouldAutohide) => {
        if (shouldAutohide === 'fullscreen') {
            hyprlandService.workspaces.forEach((workspace) => {
                App.get_window(`bar-${workspace.monitor.id}`)?.set_visible(!workspace.hasFullscreen);
            });
        }
    });
};
