import { opt } from '../../lib/options';
import { FontStyle } from '../../components/settings/shared/inputs/font/utils';

export const fontOptions = {
    size: opt('1.2rem'),
    name: opt('Ubuntu Nerd Font'),
    style: opt<FontStyle>('normal'),
    label: opt('Ubuntu Nerd Font'),
    weight: opt(600),
};