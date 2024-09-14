import { GBox, GButton, GLabel } from 'lib/types/widget';

export const Label = (name: string, sub = '', subtitleLink = ''): GBox => {
    const subTitle = (): GButton | GLabel => {
        if (subtitleLink.length) {
            return Widget.Button({
                hpack: 'start',
                vpack: 'center',
                class_name: 'options-sublabel-link',
                label: sub,
                on_primary_click: () => Utils.execAsync(`bash -c 'xdg-open ${subtitleLink}'`),
            });
        }
        return Widget.Label({
            hpack: 'start',
            vpack: 'center',
            class_name: 'options-sublabel',
            label: sub,
        });
    };
    return Widget.Box({
        vertical: true,
        hpack: 'start',
        children: [
            Widget.Label({
                hpack: 'start',
                vpack: 'center',
                class_name: 'options-label',
                label: name,
            }),
            subTitle(),
        ],
    });
};
