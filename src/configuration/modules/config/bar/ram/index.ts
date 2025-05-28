import { opt } from 'src/lib/options';
import { ResourceLabelType } from 'src/services/system/types';

export default {
    icon: opt(''),
    label: opt(true),
    labelType: opt<ResourceLabelType>('percentage'),
    round: opt(true),
    pollingInterval: opt(2000),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
};
