import { RateUnit } from '../bar';
import { NetworkResourceData } from '../customModules/network';

export const GET_DEFAULT_NETSTAT_DATA = (dataType: RateUnit): NetworkResourceData => {
    if (dataType === 'auto') {
        return { in: `0 Kib/s`, out: `0 Kib/s` };
    }

    return { in: `0 ${dataType}/s`, out: `0 ${dataType}/s` };
};
