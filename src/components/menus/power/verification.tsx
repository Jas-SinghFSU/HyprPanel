import PopupWindow from '../shared/popup/index.js';
import powermenu from './helpers/actions.js';
import { App, Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding.js';

export default (): JSX.Element => (
    <PopupWindow name="verification" transition="crossfade">
        <box className="verification">
            <box className="verification-content" expand vertical>
                <box className="text-box" vertical>
                    <label className="title" label={bind(powermenu, 'title').as((t) => t.toUpperCase())} />
                    <label
                        className="desc"
                        label={bind(powermenu, 'title').as((p) => `Are you sure you want to ${p.toLowerCase()}?`)}
                    />
                </box>
                <box className="buttons horizontal" vexpand valign={Gtk.Align.END} homogeneous>
                    <button className="verification-button bar-verification_yes" onClicked={powermenu.exec}>
                        <label label={'Yes'} />
                    </button>
                    <button
                        className="verification-button bar-verification_no"
                        onClicked={() => App.toggle_window('verification')}
                    >
                        <label label={'No'} />
                    </button>
                </box>
            </box>
        </box>
    </PopupWindow>
);
