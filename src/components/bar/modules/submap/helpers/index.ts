import { Variable } from 'astal';
import { hyprlandService } from 'src/lib/constants/services';

/**
 * Determines if a submap is enabled based on the provided submap name.
 *
 * This function checks if the given submap name is not 'default' and returns the appropriate enabled or disabled string.
 *
 * @param submap The name of the submap to check.
 * @param enabled The string to return if the submap is enabled.
 * @param disabled The string to return if the submap is disabled.
 *
 * @returns The enabled string if the submap is not 'default', otherwise the disabled string.
 */
export const isSubmapEnabled = (submap: string, enabled: string, disabled: string): string => {
    return submap !== 'default' ? enabled : disabled;
};

/**
 * Retrieves the initial submap status and updates the provided variable.
 *
 * This function gets the initial submap status from the `hyprlandService` and updates the `submapStatus` variable.
 * It removes any newline characters from the submap status and sets it to 'default' if the status is 'unknown request'.
 *
 * @param submapStatus The variable to update with the initial submap status.
 */
export const getInitialSubmap = (submapStatus: Variable<string>): void => {
    let submap = hyprlandService.message('submap');

    const newLineCarriage = /\n/g;
    submap = submap.replace(newLineCarriage, '');

    if (submap === 'unknown request') {
        submap = 'default';
    }

    submapStatus.set(submap);
};
