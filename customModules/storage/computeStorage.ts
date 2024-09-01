// @ts-expect-error
import GTop from 'gi://GTop';

import { divide, formatSizeInGiB } from 'customModules/utils';
import { Variable as VariableType } from 'types/variable';

let previousFsUsage = new GTop.glibtop_fsusage();

export const computeStorage = (round: VariableType<boolean>) => {
    try {
        const currentFsUsage = new GTop.glibtop_fsusage();

        GTop.glibtop_get_fsusage(currentFsUsage, "/");

        const total = currentFsUsage.blocks * currentFsUsage.block_size;
        const available = currentFsUsage.bavail * currentFsUsage.block_size;
        const used = total - available;

        const usedGiB = formatSizeInGiB(used, round);
        const totalGiB = formatSizeInGiB(total, round);

        previousFsUsage = currentFsUsage;

        return {
            total: totalGiB,
            used: usedGiB,
            percentage: divide([total, used], round.value),
        };
    } catch (error) {
        console.error('Error calculating RAM usage:', error);
        return { total: 0, used: 0, percentage: 0 };
    }
};

