import { opt } from 'src/lib/options';
import { ResourceLabelType } from 'src/services/system/types';

export default {
    label: opt(true),
    icon: opt('󰋊'),
    round: opt(false),
    labelType: opt<ResourceLabelType>('percentage'),
    pollingInterval: opt(2000),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
};
