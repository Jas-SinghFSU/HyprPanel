import { RateUnit } from '../bar.types';
import { NetworkResourceData } from '../customModules/network.types';

export const getDefaultNetstatData = (dataType: RateUnit): NetworkResourceData => {
    if (dataType === 'auto') {
        return { in: `0 Kib/s`, out: `0 Kib/s` };
    }

    return { in: `0 ${dataType}/s`, out: `0 ${dataType}/s` };
};
