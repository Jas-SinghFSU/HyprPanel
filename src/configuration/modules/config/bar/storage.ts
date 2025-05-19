import { opt } from 'src/lib/options';
import { ResourceLabelType } from 'src/lib/types/bar.types';

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
