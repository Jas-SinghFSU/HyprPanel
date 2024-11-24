import { Variable } from 'types/variable';

const hyprland = await Service.import('hyprland');

export const isSubmapEnabled = (submap: string, enabled: string, disabled: string): string => {
    return submap !== 'default' ? enabled : disabled;
};

export const getInitialSubmap = (submapStatus: Variable<string>): void => {
    let submap = hyprland.message('submap');

    const newLineCarriage = /\n/g;
    submap = submap.replace(newLineCarriage, '');

    if (submap === 'unknown request') {
        submap = 'default';
    }

    submapStatus.value = submap;
};
