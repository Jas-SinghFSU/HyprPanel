// @ts-expect-error is a special directive that tells the compiler to use the GTop library
import GTop from 'gi://GTop';

import { divide } from 'customModules/utils';
import { Variable as VariableType } from 'types/variable';
import { GenericResourceData } from 'lib/types/customModules/generic';

// FIX: Consolidate with Storage service class
export const computeStorage = (round: VariableType<boolean>): GenericResourceData => {
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
            percentage: divide([total, used], round.value),
        };
    } catch (error) {
        console.error('Error calculating RAM usage:', error);
        return { total: 0, used: 0, percentage: 0, free: 0 };
    }
};
