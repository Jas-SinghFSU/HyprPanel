import { WorkspaceIconMap } from 'lib/types/workspace';
import { isValidGjsColor } from 'lib/utils';

const hyprland = await Service.import('hyprland');

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

export const getWsColor = (wsIconMap: WorkspaceIconMap, i: number): string => {
    const iconEntry = wsIconMap[i];
    if (!iconEntry) {
        return '';
    }

    const hasColor = typeof iconEntry === 'object' && 'color' in iconEntry && iconEntry.color !== '';
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
    i: number,
): string => {
    if (showIcons) {
        return `workspace-icon txt-icon bar`;
    }
    if (showNumbered || showWsIcons) {
        const numActiveInd = hyprland.active.workspace.id === i ? `${numberedActiveIndicator}` : '';

        const className =
            `workspace-number can_${numberedActiveIndicator} ` +
            `${numActiveInd} ` +
            `${showWsIcons ? 'txt-icon' : ''}`;

        return className;
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
): string => {
    if (showIcons) {
        if (hyprland.active.workspace.id === i) {
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
