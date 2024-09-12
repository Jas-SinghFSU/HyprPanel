const hyprland = await Service.import('hyprland');

export const renderClassnames = (
    showIcons: boolean,
    showNumbered: boolean,
    numberedActiveIndicator: string,
    i: number,
) => {
    if (showIcons) {
        return `workspace-icon txt-icon bar`;
    }
    if (showNumbered) {
        const numActiveInd = hyprland.active.workspace.id === i ? numberedActiveIndicator : '';

        return `workspace-number can_${numberedActiveIndicator} ${numActiveInd}`;
    }
    return 'default';
};

export const renderLabel = (
    showIcons: boolean,
    available: string,
    active: string,
    occupied: string,
    workspaceMask: boolean,
    i: number,
    index: number,
    monitor: number,
) => {
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

    return workspaceMask ? `${index + 1}` : `${i}`;
};
