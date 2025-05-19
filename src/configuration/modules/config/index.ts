import { opt } from 'src/lib/options';
import { ScalingPriority } from 'src/lib/options/types';

export default {
    scalingPriority: opt<ScalingPriority>('gdk'),
    terminal: opt('$TERM'),
    tear: opt(false),
    wallpaper: {
        enable: opt(true),
        image: opt(''),
        pywal: opt(false),
    },
    hyprpanel: {
        restartAgs: opt(true),
        restartCommand: opt('hyprpanel -q; hyprpanel'),
    },
    dummy: opt(true),
    bar: undefined,
    menus: undefined,
    notifications: undefined,
};
