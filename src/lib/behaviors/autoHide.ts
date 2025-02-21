import { bind, Variable } from 'astal';
import { App } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { BarVisibility } from 'src/cli/utils/BarVisibility';
import { forceUpdater } from 'src/components/bar/modules/workspaces/helpers';
import options from 'src/options';

const hyprlandService = AstalHyprland.get_default();
const { autoHide } = options.bar;

/**
 * Sets bar visibility for a specific monitor
 *
 * @param monitorId - The ID of the monitor
 * @param isVisible - Whether the bar should be visible
 */
function setBarVisibility(monitorId: number, isVisible: boolean): void {
    const barName = `bar-${monitorId}`;

    if (BarVisibility.get(barName) && autoHide.get() !== 'donottouch') {
        App.get_window(barName)?.set_visible(isVisible);
    }
}

/**
 * Handles bar visibility when a client's fullscreen state changes
 *
 * @param client - The Hyprland client that gained focus
 */
function handleFullscreenClientVisibility(client: AstalHyprland.Client): void {
    if (!client) {
        return;
    }

    const fullscreenBinding = bind(client, 'fullscreen');

    Variable.derive([bind(fullscreenBinding)], (isFullScreen) => {
        if (autoHide.get() === 'fullscreen') {
            setBarVisibility(client.monitor.id, !isFullScreen);
        }
    });
}

/**
 * Shows bars on all monitors
 */
function showAllBars(): void {
    const monitors = hyprlandService.get_monitors();

    monitors.forEach((monitor) => {
        if (BarVisibility.get(`bar-${monitor.id}`)) {
            setBarVisibility(monitor.id, true);
        }
    });
}

/**
 * Updates bar visibility based on workspace window count
 */
function updateBarVisibilityByWindowCount(): void {
    const monitors = hyprlandService.get_monitors();
    const activeWorkspaces = monitors.map((monitor) => monitor.active_workspace);

    activeWorkspaces.forEach((workspace) => {
        const hasOneClient = workspace.get_clients().length !== 1;
        setBarVisibility(workspace.monitor.id, hasOneClient);
    });
}

/**
 * Updates bar visibility based on workspace fullscreen state
 */
function updateBarVisibilityByFullscreen(): void {
    hyprlandService.get_workspaces().forEach((workspace) => {
        setBarVisibility(workspace.monitor.id, !workspace.hasFullscreen);
    });
}

/**
 * Initializes the auto-hide behavior for bars
 * Manages visibility based on window count, fullscreen state, and user preferences
 */
export function initializeAutoHide(): void {
    Variable.derive(
        [
            bind(autoHide),
            bind(hyprlandService, 'workspaces'),
            bind(forceUpdater),
            bind(hyprlandService, 'focusedWorkspace'),
        ],
        (hideMode) => {
            if (hideMode === 'never') {
                showAllBars();
            } else if (hideMode === 'single-window') {
                updateBarVisibilityByWindowCount();
            }
        },
    );

    Variable.derive([bind(hyprlandService, 'focusedClient')], (currentClient) => {
        handleFullscreenClientVisibility(currentClient);
    });

    Variable.derive([bind(autoHide)], (hideMode) => {
        if (hideMode === 'fullscreen') {
            updateBarVisibilityByFullscreen();
        }
    });
}
