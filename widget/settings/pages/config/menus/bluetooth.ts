import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const BluetoothMenuSettings = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        child: Widget.Box({
            class_name: 'bar-theme-page paged-container',
            vertical: true,
            children: [
                Header('Bluetooth'),
                Option({
                    opt: options.menus.bluetooth.showBattery,
                    title: 'Show Battery Percentage for Connected Devices (If Supported)',
                    type: 'boolean',
                }),
                Option({
                    opt: options.menus.bluetooth.batteryState,
                    title: 'Show Battery When',
                    type: 'enum',
                    enums: ['connected', 'paired', 'always'],
                }),
                Option({
                    opt: options.menus.bluetooth.batteryIcon,
                    title: 'Battery Icon',
                    type: 'string',
                }),
            ],
        }),
    });
};
