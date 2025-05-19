import { opt } from 'src/lib/options';
import { KbLabelType } from 'src/lib/types/customModules/kbLayout.types';

export default {
    label: opt(true),
    labelType: opt<KbLabelType>('code'),
    icon: opt('󰌌'),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
