import { opt } from 'src/lib/options';
import clock from './clock';
import dashboard from './dashboard';
import media from './media';
import power from './power';
import volume from './volume';
import { Transition } from './types';

export default {
    transition: opt<Transition>('crossfade'),
    transitionTime: opt(200),
    media,
    volume,
    power,
    dashboard,
    clock,
};
