import { Variable } from 'astal';
import { hyprlandService } from 'src/lib/constants/services';

export const isSubmapEnabled = (submap: string, enabled: string, disabled: string): string => {
    return submap !== 'default' ? enabled : disabled;
};

export const getInitialSubmap = (submapStatus: Variable<string>): void => {
    let submap = hyprlandService.message('submap');

    const newLineCarriage = /\n/g;
    submap = submap.replace(newLineCarriage, '');

    if (submap === 'unknown request') {
        submap = 'default';
    }

    submapStatus.set(submap);
};
