import { opt } from 'src/lib/options';

export default {
    label: opt(true),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt('hyprpanel vol +5'),
    scrollDown: opt('hyprpanel vol -5'),
};
