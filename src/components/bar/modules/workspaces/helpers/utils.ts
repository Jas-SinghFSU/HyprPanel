import { hyprlandService } from 'src/lib/constants/services';
import { defaultApplicationIcons } from 'src/lib/constants/workspaces';
import { AppIconOptions, WorkspaceIconMap } from 'src/lib/types/workspace';
import { isValidGjsColor } from 'src/lib/utils';
import options from 'src/options';

const { monochrome, background } = options.theme.bar.buttons;
const { background: wsBackground, active } = options.theme.bar.buttons.workspaces;

const { showWsIcons, showAllActive, numbered_active_indicator: wsActiveIndicator } = options.bar.workspaces;

/**
 * Determines if a workspace is active on a given monitor.
 *
 * This function checks if the workspace with the specified index is currently active on the given monitor.
 * It uses the `showAllActive` setting and the `hyprlandService` to determine the active workspace on the monitor.
 *
 * @param monitor The index of the monitor to check.
 * @param i The index of the workspace to check.
 *
 * @returns True if the workspace is active on the monitor, false otherwise.
 */
const isWorkspaceActiveOnMonitor = (monitor: number, i: number): boolean => {
    return showAllActive.get() && hyprlandService.get_monitor(monitor)?.activeWorkspace?.id === i;
};

/**
 * Retrieves the icon for a given workspace.
 *
 * This function returns the icon associated with a workspace from the provided workspace icon map.
 * If no icon is found, it returns the workspace index as a string.
 *
 * @param wsIconMap The map of workspace icons where keys are workspace indices and values are icons or icon objects.
 * @param i The index of the workspace for which to retrieve the icon.
 *
 * @returns The icon for the workspace as a string. If no icon is found, returns the workspace index as a string.
 */
const getWsIcon = (wsIconMap: WorkspaceIconMap, i: number): string => {
    const iconEntry = wsIconMap[i];

    if (!iconEntry) {
        return `${i}`;
    }

    const hasIcon = typeof iconEntry === 'object' && 'icon' in iconEntry && iconEntry.icon !== '';

    if (typeof iconEntry === 'string' && iconEntry !== '') {
        return iconEntry;
    }

    if (hasIcon) {
        return iconEntry.icon;
    }

    return `${i}`;
};

/**
 * Retrieves the color for a given workspace.
 *
 * This function determines the color styling for a workspace based on the provided workspace icon map,
 * smart highlighting settings, and the monitor index. It returns a CSS string for the color and background.
 *
 * @param wsIconMap The map of workspace icons where keys are workspace indices and values are icon objects.
 * @param i The index of the workspace for which to retrieve the color.
 * @param smartHighlight A boolean indicating whether smart highlighting is enabled.
 * @param monitor The index of the monitor to check for active workspaces.
 *
 * @returns A CSS string representing the color and background for the workspace. If no color is found, returns an empty string.
 */
export const getWsColor = (
    wsIconMap: WorkspaceIconMap,
    i: number,
    smartHighlight: boolean,
    monitor: number,
): string => {
    const iconEntry = wsIconMap[i];
    const hasColor = typeof iconEntry === 'object' && 'color' in iconEntry && isValidGjsColor(iconEntry.color);
    if (!iconEntry) {
        return '';
    }

    if (
        showWsIcons.get() &&
        smartHighlight &&
        wsActiveIndicator.get() === 'highlight' &&
        (hyprlandService.focusedWorkspace?.id === i || isWorkspaceActiveOnMonitor(monitor, i))
    ) {
        const iconColor = monochrome.get() ? background.get() : wsBackground.get();
        const iconBackground = hasColor && isValidGjsColor(iconEntry.color) ? iconEntry.color : active.get();
        const colorCss = `color: ${iconColor};`;
        const backgroundCss = `background: ${iconBackground};`;

        return colorCss + backgroundCss;
    }

    if (hasColor && isValidGjsColor(iconEntry.color)) {
        return `color: ${iconEntry.color}; border-bottom-color: ${iconEntry.color};`;
    }

    return '';
};

/**
 * Retrieves the application icon for a given workspace.
 *
 * This function returns the appropriate application icon for the specified workspace index.
 * It considers user-defined icons, default icons, and the option to remove duplicate icons.
 *
 * @param workspaceIndex The index of the workspace for which to retrieve the application icon.
 * @param removeDuplicateIcons A boolean indicating whether to remove duplicate icons.
 * @param options An object containing user-defined icon map, default icon, and empty icon.
 *
 * @returns The application icon for the workspace as a string. If no icons are found, returns the default or empty icon.
 */
export const getAppIcon = (
    workspaceIndex: number,
    removeDuplicateIcons: boolean,
    { iconMap: userDefinedIconMap, defaultIcon, emptyIcon }: AppIconOptions,
): string => {
    const iconMap = { ...userDefinedIconMap, ...defaultApplicationIcons };

    const clients = hyprlandService
        .get_clients()
        .filter((client) => client?.workspace?.id === workspaceIndex)
        .map((client) => [client.class, client.title]);

    if (!clients.length) {
        return emptyIcon;
    }

    let icons = clients
        .map(([clientClass, clientTitle]) => {
            const maybeIcon = Object.entries(iconMap).find(([matcher]) => {
                try {
                    if (matcher.startsWith('class:')) {
                        const re = matcher.substring(6);
                        return new RegExp(re).test(clientClass);
                    }

                    if (matcher.startsWith('title:')) {
                        const re = matcher.substring(6);

                        return new RegExp(re).test(clientTitle);
                    }

                    return new RegExp(matcher, 'i').test(clientClass);
                } catch {
                    return false;
                }
            });

            if (!maybeIcon) {
                return undefined;
            }

            return maybeIcon.at(1);
        })
        .filter((x) => x);

    if (removeDuplicateIcons) {
        icons = [...new Set(icons)];
    }

    if (icons.length) {
        return icons.join(' ');
    }

    return defaultIcon;
};

/**
 * Renders the class names for a workspace.
 *
 * This function generates the appropriate class names for a workspace based on various settings such as
 * whether to show icons, numbered workspaces, workspace icons, and smart highlighting.
 *
 * @param showIcons A boolean indicating whether to show icons.
 * @param showNumbered A boolean indicating whether to show numbered workspaces.
 * @param numberedActiveIndicator The indicator for active numbered workspaces.
 * @param showWsIcons A boolean indicating whether to show workspace icons.
 * @param smartHighlight A boolean indicating whether smart highlighting is enabled.
 * @param monitor The index of the monitor to check for active workspaces.
 * @param i The index of the workspace for which to render class names.
 *
 * @returns The class names for the workspace as a string.
 */
export const renderClassnames = (
    showIcons: boolean,
    showNumbered: boolean,
    numberedActiveIndicator: string,
    showWsIcons: boolean,
    smartHighlight: boolean,
    monitor: number,
    i: number,
): string => {
    const isWorkspaceActive = hyprlandService.focusedWorkspace?.id === i || isWorkspaceActiveOnMonitor(monitor, i);
    const isActive = isWorkspaceActive ? 'active' : '';

    if (showIcons) {
        return `workspace-icon txt-icon bar ${isActive}`;
    }

    if (showNumbered || showWsIcons) {
        const numActiveInd = isWorkspaceActive ? numberedActiveIndicator : '';

        const wsIconClass = showWsIcons ? 'txt-icon' : '';
        const smartHighlightClass = smartHighlight ? 'smart-highlight' : '';

        const className = `workspace-number can_${numberedActiveIndicator} ${numActiveInd} ${wsIconClass} ${smartHighlightClass} ${isActive}`;

        return className.trim();
    }

    return `default ${isActive}`;
};

/**
 * Renders the label for a workspace.
 *
 * This function generates the appropriate label for a workspace based on various settings such as
 * whether to show icons, application icons, workspace icons, and workspace indicators.
 *
 * @param showIcons A boolean indicating whether to show icons.
 * @param availableIndicator The indicator for available workspaces.
 * @param activeIndicator The indicator for active workspaces.
 * @param occupiedIndicator The indicator for occupied workspaces.
 * @param showAppIcons A boolean indicating whether to show application icons.
 * @param appIcons The application icons as a string.
 * @param workspaceMask A boolean indicating whether to mask the workspace.
 * @param showWorkspaceIcons A boolean indicating whether to show workspace icons.
 * @param wsIconMap The map of workspace icons where keys are workspace indices and values are icons or icon objects.
 * @param i The index of the workspace for which to render the label.
 * @param index The index of the workspace in the list.
 * @param monitor The index of the monitor to check for active workspaces.
 *
 * @returns The label for the workspace as a string.
 */
export const renderLabel = (
    showIcons: boolean,
    availableIndicator: string,
    activeIndicator: string,
    occupiedIndicator: string,
    showAppIcons: boolean,
    appIcons: string,
    workspaceMask: boolean,
    showWorkspaceIcons: boolean,
    wsIconMap: WorkspaceIconMap,
    i: number,
    index: number,
    monitor: number,
): string => {
    if (showAppIcons) {
        return appIcons;
    }

    if (showIcons) {
        if (hyprlandService.focusedWorkspace?.id === i || isWorkspaceActiveOnMonitor(monitor, i)) {
            return activeIndicator;
        }
        if ((hyprlandService.get_workspace(i)?.get_clients().length || 0) > 0) {
            return occupiedIndicator;
        }
        if (monitor !== -1) {
            return availableIndicator;
        }
    }

    if (showWorkspaceIcons) {
        return getWsIcon(wsIconMap, i);
    }

    return workspaceMask ? `${index + 1}` : `${i}`;
};
