import Window from 'types/widgets/window.js';
import DropdownMenu from '../shared/dropdown/index.js';
import { Ethernet } from './ethernet/index.js';
import { Wifi } from './wifi/index.js';
import { Attribute, Child } from 'lib/types/widget.js';
import options from 'options.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'networkmenu',
        transition: options.menus.transition.bind('value'),
        child: Widget.Box({
            class_name: 'menu-items network',
            child: Widget.Box({
                vertical: true,
                hexpand: true,
                class_name: 'menu-items-container network',
                children: [Ethernet(), Wifi()],
            }),
        }),
    });
};
