import { opt } from 'src/lib/options';

export default {
    label: opt(true),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt('hyprpanel volup 5'),
    scrollDown: opt('hyprpanel voldown 5'),
};
