import { Gtk } from 'astal/gtk3';

export const NotFoundButton = ({ type }: { type: string }): JSX.Element => {
    return (
        <button className={`menu-unfound-button ${type}`} sensitive={false}>
            <box>
                <box halign={Gtk.Align.START}>
                    <label className={`menu-button-name ${type}`} label={`No ${type} devices found...`} />
                </box>
            </box>
        </button>
    );
};
