import { PowerOptions } from 'src/lib/types/options';
import { isPrimaryClick } from 'src/lib/utils';
import { handleClick } from './helpers';

const PowerActionButton = (icon: string, tooltip: string, action: PowerOptions): JSX.Element => {
    return (
        <button
            className={`dashboard-button ${action}`}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    handleClick(action);
                }
            }}
            tooltip_text={tooltip}
            vexpand
        >
            <label className={'txt-icon'} label={icon} />
        </button>
    );
};

export const ShutDown = (): JSX.Element => {
    return PowerActionButton('󰐥', 'Shut Down', 'shutdown');
};

export const Reboot = (): JSX.Element => {
    return PowerActionButton('󰜉', 'Reboot', 'reboot');
};

export const LogOut = (): JSX.Element => {
    return PowerActionButton('󰿅', 'Log Out', 'logout');
};

export const Sleep = (): JSX.Element => {
    return PowerActionButton('󰤄', 'Sleep', 'sleep');
};
