import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    background: opt(primaryColors.base2),
    enableBorder: opt(false),
    smartHighlight: opt(true),
    border: opt(primaryColors.pink),
    available: opt(primaryColors.sky),
    occupied: opt(primaryColors.flamingo),
    active: opt(primaryColors.pink),
    hover: opt(primaryColors.pink),
    numbered_active_highlight_border: opt('0.2em'),
    numbered_active_highlight_padding: opt('0.2em'),
    numbered_inactive_padding: opt('0.2em'),
    numbered_active_highlighted_text_color: opt(primaryColors.mantle),
    numbered_active_underline_color: opt(primaryColors.pink),
    spacing: opt('0.5em'),
    fontSize: opt('1.2em'),
    pill: {
        radius: opt('1.9rem * 0.6'),
        height: opt('4em'),
        width: opt('4em'),
        active_width: opt('12em'),
    },
};
