import { GBox } from 'lib/types/widget';

export const Header = (headerName: string): GBox => {
    return Widget.Box({
        class_name: 'options-header',
        children: [
            Widget.Label({
                class_name: 'label-name',
                label: headerName,
            }),
            Widget.Separator({
                vpack: 'center',
                hexpand: true,
                class_name: 'menu-separator',
            }),
        ],
    });
};
