import { opt } from 'src/lib/options';
import { ResourceLabelType } from 'src/services/system/types';
import { StorageUnit } from './types';
import { TooltipStyle } from 'src/components/bar/modules/storage/helpers/tooltipFormatters';

export default {
    paths: opt(['/']),
    label: opt(true),
    icon: opt('󰋊'),
    round: opt(false),
    units: opt<StorageUnit>('auto'),
    labelType: opt<ResourceLabelType>('percentage'),
    tooltipStyle: opt<TooltipStyle>('percentage-bar'),
    pollingInterval: opt(2000),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
};
