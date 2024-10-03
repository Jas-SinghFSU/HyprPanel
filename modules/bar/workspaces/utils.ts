import { WorkspaceIconMap } from 'lib/types/workspace';
import { isValidGjsColor } from 'lib/utils';
import options from 'options';
import { Monitor } from 'types/service/hyprland';

const hyprland = await Service.import('hyprland');

const { monochrome, background } = options.theme.bar.buttons;
const { background: wsBackground, active } = options.theme.bar.buttons.workspaces;

const { showWsIcons, showAllActive, numbered_active_indicator: activeIndicator } = options.bar.workspaces;

const isWorkspaceActiveOnMonitor = (monitor: number, monitors: Monitor[], i: number): boolean => {
    return showAllActive.value && monitors[monitor]?.activeWorkspace?.id === i;
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
    monitors: Monitor[],
): string => {
    const iconEntry = wsIconMap[i];
    const hasColor = typeof iconEntry === 'object' && 'color' in iconEntry && isValidGjsColor(iconEntry.color);
    if (!iconEntry) {
        return '';
    }

    if (
        showWsIcons.value &&
        smartHighlight &&
        activeIndicator.value === 'highlight' &&
        (hyprland.active.workspace.id === i || isWorkspaceActiveOnMonitor(monitor, monitors, i))
    ) {
        const iconColor = monochrome.value ? background : wsBackground;
        const iconBackground = hasColor && isValidGjsColor(iconEntry.color) ? iconEntry.color : active.value;
        const colorCss = `color: ${iconColor};`;
        const backgroundCss = `background: ${iconBackground};`;

        return colorCss + backgroundCss;
    }

    if (hasColor && isValidGjsColor(iconEntry.color)) {
        return `color: ${iconEntry.color}; border-bottom-color: ${iconEntry.color};`;
    }

    return '';
};

export const renderClassnames = (
    showIcons: boolean,
    showNumbered: boolean,
    numberedActiveIndicator: string,
    showWsIcons: boolean,
    smartHighlight: boolean,
    monitor: number,
    monitors: Monitor[],
    i: number,
): string => {
    if (showIcons) {
        return 'workspace-icon txt-icon bar';
    }

    if (showNumbered || showWsIcons) {
        const numActiveInd =
            hyprland.active.workspace.id === i || isWorkspaceActiveOnMonitor(monitor, monitors, i)
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
    available: string,
    active: string,
    occupied: string,
    workspaceMask: boolean,
    showWsIcons: boolean,
    wsIconMap: WorkspaceIconMap,
    i: number,
    index: number,
    monitor: number,
    monitors: Monitor[],
): string => {
    if (showIcons) {
        if (hyprland.active.workspace.id === i || isWorkspaceActiveOnMonitor(monitor, monitors, i)) {
            return active;
        }
        if ((hyprland.getWorkspace(i)?.windows || 0) > 0) {
            return occupied;
        }
        if (monitor !== -1) {
            return available;
        }
    }
    if (showWsIcons) {
        return getWsIcon(wsIconMap, i);
    }
    return workspaceMask ? `${index + 1}` : `${i}`;
};
