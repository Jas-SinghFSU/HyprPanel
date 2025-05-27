import { DriveStorageData } from 'src/services/system/storage/types';
import StorageService from 'src/services/system/storage';
import { renderResourceLabel } from 'src/components/bar/utils/systemResource';
import { SizeUnit } from 'src/lib/units/size/types';

export type TooltipStyle = 'percentage-bar' | 'tree' | 'simple';

/**
 * Formats storage tooltip information based on the selected style
 * @param paths - Array of mount paths to display
 * @param storageService - The storage service instance
 * @param style - The tooltip formatting style
 * @param lblTyp - The label type for resource display
 * @param round - Whether to round values
 * @param sizeUnits - The size unit to use
 */
export function formatStorageTooltip(
    paths: string[],
    storageService: StorageService,
    style: TooltipStyle,
    round: boolean,
    sizeUnits?: SizeUnit,
): string {
    const driveData = paths
        .map((path) => storageService.getDriveInfo(path))
        .filter((usage): usage is DriveStorageData => usage !== undefined);

    switch (style) {
        case 'percentage-bar':
            return formatPercentageBarStyle(driveData, round, sizeUnits);
        case 'tree':
            return formatTreeStyle(driveData, round, sizeUnits);
        case 'simple':
        default:
            return formatSimpleStyle(driveData, round, sizeUnits);
    }
}

/**
 * Creates a visual percentage bar using Unicode characters
 * @param percentage - The percentage value (0-100)
 */
function generatePercentBar(percentage: number): string {
    const filledBlocks = Math.round(percentage / 10);
    const emptyBlocks = 10 - filledBlocks;
    return '▰'.repeat(filledBlocks) + '▱'.repeat(emptyBlocks);
}

/**
 * Formats tooltip with visual percentage bars
 */
function formatPercentageBarStyle(drives: DriveStorageData[], round: boolean, sizeUnits?: SizeUnit): string {
    return drives
        .map((usage) => {
            const lbl = renderResourceLabel('used/total', usage, round, sizeUnits);
            const percentBar = generatePercentBar(usage.percentage);
            const displayName = usage.path === '/' ? '◉ System' : `◉ ${usage.name}`;

            return `${displayName}\n    ${percentBar}  ${usage.percentage.toFixed(1)}%\n    ${lbl}`;
        })
        .join('\n\n');
}

/**
 * Formats tooltip with tree-like structure
 */
function formatTreeStyle(drives: DriveStorageData[], round: boolean, sizeUnits?: SizeUnit): string {
    return drives
        .map((usage) => {
            const lbl = renderResourceLabel('used/total', usage, round, sizeUnits);
            const displayName = usage.path === '/' ? 'System' : usage.name;

            return `• ${displayName}: ${usage.percentage.toFixed(1)}%\n  └─ ${lbl}`;
        })
        .join('\n');
}

/**
 * Formats tooltip with simple text layout
 */
function formatSimpleStyle(drives: DriveStorageData[], round: boolean, sizeUnits?: SizeUnit): string {
    return drives
        .map((usage) => {
            const lbl = renderResourceLabel('used/total', usage, round, sizeUnits);
            const displayName = usage.path === '/' ? 'System' : usage.name;

            return `[${displayName}]: ${lbl}`;
        })
        .join('\n');
}
