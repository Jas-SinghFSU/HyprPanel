import GTop from 'gi://GTop';

import { divide } from 'src/components/bar/utils/helpers';
import { Variable } from 'astal';
import { GenericResourceData } from 'src/lib/types/customModules/generic';

/**
 * Computes the storage usage for the root filesystem.
 *
 * This function calculates the total, used, and available storage for the root filesystem.
 * It returns an object containing these values along with the percentage of used storage.
 *
 * @param round A Variable<boolean> indicating whether to round the percentage value.
 *
 * @returns An object containing the total, used, free storage in bytes, and the percentage of used storage.
 *
 * FIX: Consolidate with Storage service class
 */
export const computeStorage = (round: Variable<boolean>): GenericResourceData => {
    try {
        const currentFsUsage = new GTop.glibtop_fsusage();

        GTop.glibtop_get_fsusage(currentFsUsage, '/');

        const total = currentFsUsage.blocks * currentFsUsage.block_size;
        const available = currentFsUsage.bavail * currentFsUsage.block_size;
        const used = total - available;

        return {
            total,
            used,
            free: available,
            percentage: divide([total, used], round.get()),
        };
    } catch (error) {
        console.error('Error calculating RAM usage:', error);
        return { total: 0, used: 0, percentage: 0, free: 0 };
    }
};
