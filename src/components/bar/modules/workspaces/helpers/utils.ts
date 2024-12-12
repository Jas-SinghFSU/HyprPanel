import { hyprlandService } from 'src/lib/constants/services';
import { defaultApplicationIcons } from 'src/lib/constants/workspaces';
import type { ClientAttributes, AppIconOptions, WorkspaceIconMap } from 'src/lib/types/workspace';
import { isValidGjsColor } from 'src/lib/utils';
import options from 'src/options';

const { monochrome, background } = options.theme.bar.buttons;
const { background: wsBackground, active } = options.theme.bar.buttons.workspaces;

const { showWsIcons, showAllActive, numbered_active_indicator: wsActiveIndicator } = options.bar.workspaces;

const isWorkspaceActiveOnMonitor = (monitor: number, i: number): boolean => {
    return showAllActive.get() && hyprlandService.get_monitor(monitor).activeWorkspace.id === i;
};

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
        (hyprlandService.focusedWorkspace.id === i || isWorkspaceActiveOnMonitor(monitor, i))
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

export const getAppIcon = (
    workspaceIndex: number,
    removeDuplicateIcons: boolean,
    { iconMap: userDefinedIconMap, defaultIcon, emptyIcon }: AppIconOptions,
): string => {
    // append the default icons so user defined icons take precedence
    const iconMap = { ...userDefinedIconMap, ...defaultApplicationIcons };

    // detect the clients attributes on the current workspace
    const clients: ReadonlyArray<ClientAttributes> = hyprlandService
        .get_clients()
        .filter((client) => client.workspace.id === workspaceIndex)
        .map((client) => [client.class, client.title]);

    if (!clients.length) {
        return emptyIcon;
    }

    // map the client attributes to icons
    let icons = clients
        .map(([clientClass, clientTitle]) => {
            const maybeIcon = Object.entries(iconMap).find(([matcher]) => {
                // non-valid Regex construction could result in a syntax error
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

    // remove duplicate icons
    if (removeDuplicateIcons) {
        icons = [...new Set(icons)];
    }

    if (icons.length) {
        return icons.join(' ');
    }

    return defaultIcon;
};

export const renderClassnames = (
    showIcons: boolean,
    showNumbered: boolean,
    numberedActiveIndicator: string,
    showWsIcons: boolean,
    smartHighlight: boolean,
    monitor: number,
    i: number,
): string => {
    if (showIcons) {
        return 'workspace-icon txt-icon bar';
    }

    if (showNumbered || showWsIcons) {
        const numActiveInd =
            hyprlandService.focusedWorkspace.id === i || isWorkspaceActiveOnMonitor(monitor, i)
                ? numberedActiveIndicator
                : '';

        const wsIconClass = showWsIcons ? 'txt-icon' : '';
        const smartHighlightClass = smartHighlight ? 'smart-highlight' : '';

        const className = `workspace-number can_${numberedActiveIndicator} ${numActiveInd} ${wsIconClass} ${smartHighlightClass}`;

        return className.trim();
    }

    return 'default';
};

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
        if (hyprlandService.focusedWorkspace.id === i || isWorkspaceActiveOnMonitor(monitor, i)) {
            return activeIndicator;
        }
        if ((hyprlandService.get_workspace(i)?.clients.length || 0) > 0) {
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
