import { LogOut, Reboot, ShutDown, Sleep } from './PowerButtons';

export const PowerMenu = (): JSX.Element => {
    return (
        <box className={'power-menu-container dashboard-card'} vertical vexpand>
            <ShutDown />
            <Reboot />
            <LogOut />
            <Sleep />
        </box>
    );
};
