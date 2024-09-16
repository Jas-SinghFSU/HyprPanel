import Window from 'types/widgets/window.js';
import PopupWindow from '../shared/popup/index.js';
import powermenu from './helpers/actions.js';
import { Attribute, Child } from 'lib/types/widget.js';

export default (): Window<Child, Attribute> =>
    PopupWindow({
        name: 'verification',
        transition: 'crossfade',
        child: Widget.Box({
            class_name: 'verification',
            child: Widget.Box({
                class_name: 'verification-content',
                expand: true,
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: 'text-box',
                        vertical: true,
                        children: [
                            Widget.Label({
                                class_name: 'title',
                                label: powermenu.bind('title').as((t) => t.toUpperCase()),
                            }),
                            Widget.Label({
                                class_name: 'desc',
                                label: powermenu
                                    .bind('title')
                                    .as((p) => `Are you sure you want to ${p.toLowerCase()}?`),
                            }),
                        ],
                    }),
                    Widget.Box({
                        class_name: 'buttons horizontal',
                        vexpand: true,
                        vpack: 'end',
                        homogeneous: true,
                        children: [
                            Widget.Button({
                                class_name: 'verification-button bar-verification_yes',
                                child: Widget.Label('Yes'),
                                on_clicked: powermenu.exec,
                            }),
                            Widget.Button({
                                class_name: 'verification-button bar-verification_no',
                                child: Widget.Label('No'),
                                on_clicked: () => App.toggleWindow('verification'),
                            }),
                        ],
                    }),
                ],
            }),
        }),
    });
