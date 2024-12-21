import { App, Gtk } from 'astal/gtk3';
import icons from 'src/lib/icons/icons';
import { isPrimaryClick } from 'src/lib/utils';

export const Header = (): JSX.Element => {
    return (
        <centerbox className="header">
            <button
                className="reset"
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        options.reset();
                    }
                }}
                tooltipText={'Reset All Settings'}
                halign={Gtk.Align.START}
                valign={Gtk.Align.START}
            >
                <icon icon={icons.ui.refresh} />
            </button>
            <box />
            <button
                className="close"
                halign={Gtk.Align.END}
                valign={Gtk.Align.START}
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        App.get_window('settings-dialog')?.set_visible(false);
                    }
                }}
            >
                <icon icon={icons.ui.close} />
            </button>
        </centerbox>
    );
};
