import { Action } from 'src/lib/types/power.js';
import PopupWindow from '../shared/popup/index.js';
import powermenu from './helpers/actions.js';
import options from 'src/options.js';
import { isPrimaryClick } from 'src/lib/utils.js';
import icons from 'src/lib/icons/icons.js';
import { bind } from 'astal/binding.js';
import { Gtk } from 'astal/gtk3';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';

const { transition } = options.menus;

const SysButton = ({ action, label }: SysButtonProps): JSX.Element => {
    return (
        <button
            className={`widget-button powermenu-button-${action}`}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    powermenu.action(action);
                }
            }}
        >
            <box className={'system-button widget-box'} vertical vexpand valign={Gtk.Align.FILL}>
                <icon className={`system-button_icon txt-icon ${action}`} icon={icons.powermenu[action]} vexpand />
                <label className={`system-button_label ${action}`} label={label} vexpand />
            </box>
        </button>
    );
};

export default (): JSX.Element => (
    <PopupWindow name={'powermenu'} transition={bind(transition).as((transition) => RevealerTransitionMap[transition])}>
        <box className={'powermenu horizontal'}>
            <SysButton action={'shutdown'} label={'SHUTDOWN'} />
            <SysButton action={'logout'} label={'LOG OUT'} />
            <SysButton action={'reboot'} label={'REBOOT'} />
            <SysButton action={'sleep'} label={'SLEEP'} />
        </box>
    </PopupWindow>
);

interface SysButtonProps {
    action: Action;
    label: string;
}
