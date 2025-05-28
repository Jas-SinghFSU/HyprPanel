import { opt } from 'src/lib/options';

export default {
    label: opt(true),
    onIcon: opt('󰒳'),
    offIcon: opt('󰒲'),
    onLabel: opt('On'),
    offLabel: opt('Off'),
    pollingInterval: opt(1000 * 2),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
