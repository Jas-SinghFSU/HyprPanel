import { opt } from '../../lib/options';
import { BarLocation, WindowLayer, BorderLocation } from '../../lib/options/options.types';
import { colors } from '../theme/colors';

export const generalBarOptions = {
    scaling: opt(100),
    floating: opt(false),
    location: opt<BarLocation>('top'),
    layer: opt<WindowLayer>('top'),
    margin_top: opt('0.5em'),
    opacity: opt(100),
    enableShadow: opt(false),
    shadow: opt('0px 1px 2px 1px #16161e'),
    shadowMargins: opt('0px 0px 4px 0px'),
    margin_bottom: opt('0em'),
    margin_sides: opt('0.5em'),
    border_radius: opt('0.4em'),
    outer_spacing: opt('1.6em'),
    label_spacing: opt('0.5em'),
    transparent: opt(false),
    dropdownGap: opt('2.9em'),
    background: opt(colors.crust),
    border: {
        location: opt<BorderLocation>('none'),
        width: opt('0.15em'),
        color: opt(colors.lavender),
    },
};

