import Window from 'types/widgets/window.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { Media } from './media.js';
import { Attribute, Child } from 'lib/types/widget.js';
import options from 'options.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'mediamenu',
        transition: options.menus.transition.bind('value'),
        child: Widget.Box({
            class_name: 'menu-items media',
            hpack: 'fill',
            hexpand: true,
            child: Widget.Box({
                class_name: 'menu-items-container media',
                hpack: 'fill',
                hexpand: true,
                child: Media(),
            }),
        }),
    });
};
