const bluetooth = await Service.import('bluetooth');
import { label } from './label.js';
import { devices } from './devicelist.js';
import { BoxWidget } from 'lib/types/widget.js';

const Devices = (): BoxWidget => {
    return Widget.Box({
        class_name: 'menu-section-container',
        vertical: true,
        children: [
            label(bluetooth),
            Widget.Box({
                class_name: 'menu-items-section',
                child: Widget.Box({
                    class_name: 'menu-content',
                    vertical: true,
                    setup: (self) => {
                        devices(bluetooth, self);
                    },
                }),
            }),
        ],
    });
};

export { Devices };
