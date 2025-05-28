import { opt } from 'src/lib/options';

export default {
    label: opt(true),
    showSubmapName: opt(true),
    enabledIcon: opt('󰌐'),
    disabledIcon: opt('󰌌'),
    enabledText: opt('Submap On'),
    disabledText: opt('Submap off'),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
