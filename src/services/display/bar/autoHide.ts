import { bind, Variable } from 'astal';
import { App } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import options from 'src/configuration';
import { BarVisibility } from '.';
import { WorkspaceService } from 'src/services/workspace';

/**
 * Service that manages auto-hide behavior for bars across monitors
 */
export class BarAutoHideService {
    private static _instance: BarAutoHideService;

    private _workspaceService = WorkspaceService.getInstance();
    private _hyprlandService = AstalHyprland.get_default();
    private _autoHide = options.bar.autoHide;

    private _subscriptions: {
        workspace: Variable<void> | undefined;
        client: Variable<void> | undefined;
        autoHide: Variable<void> | undefined;
    } = {
        workspace: undefined,
        client: undefined,
        autoHide: undefined,
    };

    private constructor() {}

    /**
     * Gets the singleton instance of the BarAutoHideService
     */
    public static getInstance(): BarAutoHideService {
        if (!this._instance) {
            this._instance = new BarAutoHideService();
        }

        return this._instance;
    }

    /**
     * Initializes the auto-hide behavior for bars
     * Manages visibility based on window count, fullscreen state, and user preferences
     */
    public initialize(): void {
        this.destroy();

        this._subscriptions.workspace = Variable.derive(
            [
                bind(this._autoHide),
                bind(this._hyprlandService, 'workspaces'),
                bind(this._workspaceService.forceUpdater),
                bind(this._hyprlandService, 'focusedWorkspace'),
            ],
            (hideMode) => {
                if (hideMode === 'never') {
                    this._showAllBars();
                } else if (hideMode === 'single-window') {
                    this._handleSingleWindowAutoHide();
                }
            },
        );

        this._subscriptions.client = Variable.derive(
            [bind(this._hyprlandService, 'focusedClient')],
            (currentClient) => {
                this._handleFullscreenAutoHide(currentClient);
            },
        );

        this._subscriptions.autoHide = Variable.derive([bind(this._autoHide)], (hideMode) => {
            if (hideMode === 'fullscreen') {
                this._updateBarVisibilityByFullscreen();
            }
        });
    }

    /**
     * Cleanup subscriptions and reset state
     */
    public destroy(): void {
        Object.values(this._subscriptions).forEach((sub) => sub?.drop());
    }

    /**
     * Sets bar visibility for a specific monitor
     *
     * @param monitorId - The ID of the monitor whose bar visibility to set
     * @param isVisible - Whether the bar should be visible
     */
    private _setBarVisibility(monitorId: number, isVisible: boolean): void {
        const barName = `bar-${monitorId}`;

        if (!BarVisibility.get(barName)) {
            return;
        }

        const window = App.get_window(barName);
        if (window && !window.get_window()?.is_destroyed()) {
            try {
                window.set_visible(isVisible);
            } catch (error) {
                console.warn(`[BarAutoHide] Failed to set visibility for ${barName}:`, error);
            }
        }
    }

    /**
     * Handles bar visibility when a client's fullscreen state changes
     *
     * @param client - The Hyprland client whose fullscreen state to monitor
     */
    private _handleFullscreenAutoHide(client: AstalHyprland.Client): void {
        if (client === null) {
            return;
        }

        const fullscreenBinding = bind(client, 'fullscreen');

        Variable.derive([bind(fullscreenBinding)], (isFullScreen) => {
            if (this._autoHide.get() === 'fullscreen' && client.monitor?.id !== undefined) {
                this._setBarVisibility(client.monitor?.id, !Boolean(isFullScreen));
            }
        });
    }

    /**
     * Updates bar visibility based on workspace window count
     */
    private _handleSingleWindowAutoHide(): void {
        const monitors = this._hyprlandService.get_monitors();
        const activeWorkspaces = monitors.map((monitor) => monitor.active_workspace);

        activeWorkspaces.forEach((workspace) => {
            const hasOneClient = workspace.get_clients().length !== 1;
            this._setBarVisibility(workspace.monitor.id, hasOneClient);
        });
    }

    /**
     * Shows bars on all monitors
     */
    private _showAllBars(): void {
        const monitors = this._hyprlandService.get_monitors();

        monitors.forEach((monitor) => {
            if (BarVisibility.get(`bar-${monitor.id}`)) {
                this._setBarVisibility(monitor.id, true);
            }
        });
    }

    /**
     * Updates bar visibility based on workspace fullscreen state
     */
    private _updateBarVisibilityByFullscreen(): void {
        this._hyprlandService.get_workspaces().forEach((workspace) => {
            this._setBarVisibility(workspace.monitor.id, !workspace.hasFullscreen);
        });
    }
}
