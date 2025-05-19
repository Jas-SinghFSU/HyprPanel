import { opt } from 'src/lib/options';
import { ResourceLabelType } from 'src/lib/types/bar.types';

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
