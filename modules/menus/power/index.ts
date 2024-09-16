import { Action } from 'lib/types/power.js';
import PopupWindow from '../shared/popup/index.js';
import powermenu from './helpers/actions.js';
import icons from '../../icons/index.js';
import Window from 'types/widgets/window.js';
import { Attribute, Child, GButton } from 'lib/types/widget.js';

const SysButton = (action: Action, label: string): GButton =>
    Widget.Button({
        class_name: `widget-button powermenu-button-${action}`,
        on_clicked: () => powermenu.action(action),
        child: Widget.Box({
            vertical: true,
            class_name: 'system-button widget-box',
            children: [
                Widget.Icon({
                    class_name: `system-button_icon ${action}`,
                    icon: icons.powermenu[action],
                }),
                Widget.Label({
                    class_name: `system-button_label ${action}`,
                    label,
                }),
            ],
        }),
    });
export default (): Window<Child, Attribute> =>
    PopupWindow({
        name: 'powermenu',
        transition: 'crossfade',
        child: Widget.Box({
            class_name: 'powermenu horizontal',
            children: [
                SysButton('shutdown', 'SHUTDOWN'),
                SysButton('logout', 'LOG OUT'),
                SysButton('reboot', 'REBOOT'),
                SysButton('sleep', 'SLEEP'),
            ],
        }),
    });
