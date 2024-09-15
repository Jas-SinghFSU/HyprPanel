import DropdownMenu from '../shared/dropdown/index.js';
import { EnergyProfiles } from './profiles/index.js';
import { Brightness } from './brightness/index.js';
import { Attribute, Child } from 'lib/types/widget.js';
import Window from 'types/widgets/window.js';

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'energymenu',
        transition: 'crossfade',
        child: Widget.Box({
            class_name: 'menu-items energy',
            hpack: 'fill',
            hexpand: true,
            child: Widget.Box({
                vertical: true,
                hpack: 'fill',
                hexpand: true,
                class_name: 'menu-items-container energy',
                children: [Brightness(), EnergyProfiles()],
            }),
        }),
    });
};
