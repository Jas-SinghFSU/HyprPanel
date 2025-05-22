import { opt } from 'src/lib/options';
import { NetstatLabelType, RateUnit } from 'src/services/system/types';

export default {
    label: opt(true),
    networkInterface: opt(''),
    dynamicIcon: opt(false),
    icon: opt('󰖟'),
    networkInLabel: opt('↓'),
    networkOutLabel: opt('↑'),
    round: opt(true),
    labelType: opt<NetstatLabelType>('full'),
    rateUnit: opt<RateUnit>('auto'),
    pollingInterval: opt(2000),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
};
