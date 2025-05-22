import {
    formatSizeInTiB,
    formatSizeInGiB,
    formatSizeInMiB,
    formatSizeInKiB,
    autoFormatSize,
    getPostfix,
} from 'src/lib/formatters/size';
import { ResourceLabelType, GenericResourceData } from 'src/services/system/types';

/**
 * Calculates the percentage of used resources.
 *
 * This function calculates the percentage of used resources based on the total and used values.
 * It can optionally round the result to the nearest integer.
 *
 * @param totalUsed An array containing the total and used values.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The percentage of used resources as a number.
 */
export const divide = ([total, used]: number[], round: boolean): number => {
    const percentageTotal = (used / total) * 100;

    if (round) {
        return total > 0 ? Math.round(percentageTotal) : 0;
    }

    return total > 0 ? parseFloat(percentageTotal.toFixed(2)) : 0;
};

/**
 * Renders a resource label based on the label type and resource data.
 *
 * This function generates a resource label string based on the provided label type, resource data, and rounding option.
 * It formats the used, total, and free resource values and calculates the percentage if needed.
 *
 * @param lblType The type of label to render (used/total, used, free, or percentage).
 * @param rmUsg An object containing the resource usage data (used, total, percentage, and free).
 * @param round A boolean indicating whether to round the values.
 *
 * @returns The rendered resource label as a string.
 */
export const renderResourceLabel = (
    lblType: ResourceLabelType,
    rmUsg: GenericResourceData,
    round: boolean,
): string => {
    const { used, total, percentage, free } = rmUsg;

    const formatFunctions = {
        TiB: formatSizeInTiB,
        GiB: formatSizeInGiB,
        MiB: formatSizeInMiB,
        KiB: formatSizeInKiB,
        B: (size: number): number => size,
    };

    const totalSizeFormatted = autoFormatSize(total, round);
    const postfix = getPostfix(total);

    const formatUsed = formatFunctions[postfix] ?? formatFunctions['B'];
    const usedSizeFormatted = formatUsed(used, round);

    if (lblType === 'used/total') {
        return `${usedSizeFormatted}/${totalSizeFormatted} ${postfix}`;
    }
    if (lblType === 'used') {
        return `${autoFormatSize(used, round)} ${getPostfix(used)}`;
    }
    if (lblType === 'free') {
        return `${autoFormatSize(free, round)} ${getPostfix(free)}`;
    }

    return `${percentage}%`;
};

/**
 * Formats a tooltip based on the data type and label type.
 *
 * This function generates a tooltip string based on the provided data type and label type.
 *
 * @param dataType The type of data to include in the tooltip.
 * @param lblTyp The type of label to format the tooltip for (used, free, used/total, or percentage).
 *
 * @returns The formatted tooltip as a string.
 */
export const formatTooltip = (dataType: string, lblTyp: ResourceLabelType): string => {
    switch (lblTyp) {
        case 'used':
            return `Used ${dataType}`;
        case 'free':
            return `Free ${dataType}`;
        case 'used/total':
            return `Used/Total ${dataType}`;
        case 'percentage':
            return `Percentage ${dataType} Usage`;
        default:
            return '';
    }
};
