import DropdownMenu from '../shared/dropdown/index.js';
import options from 'src/options.js';
import Variable from 'astal/variable';
import { bind } from 'astal/binding';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';
import { App, Gtk } from 'astal/gtk3';
import Separator from 'src/components/shared/Separator.js';
import AstalApps from 'gi://AstalApps?version=0.1'
import { bash, icon } from 'src/lib/utils.js';
import { Entry, EntryProps, Scrollable } from 'astal/gtk3/widget';

import PopupWindow from '../shared/popup/index.js';

const apps = new AstalApps.Apps({
    nameMultiplier: 2,
    keywordsMultiplier: 2,
    executableMultiplier: 1,
    entryMultiplier: 0.5,
    categoriesMultiplier: 0.5,
});

interface ApplicationItemProps {
    app: AstalApps.Application;
    onLaunched?: () => void;
}

function launch(app: AstalApps.Application): void {
    const exe = app.executable
        .split(/\s+/)
        .filter((str) => !str.startsWith('%') && !str.startsWith('@'))
        .join(' ');

    bash(`hyprctl dispatch exec "${exe}"`);
    app.frequency += 1;
}

const ApplicationItem = ({ app, onLaunched }: ApplicationItemProps): JSX.Element => {
    return (
        <button className="notification-card" halign={Gtk.Align.FILL} valign={Gtk.Align.START} onClick={() => { launch(app); onLaunched?.() }}>
            <box spacing={5}>
                <icon className="notification-card-image icon" margin={5} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} vexpand={false} icon={icon(app.iconName)} />
                <label halign={Gtk.Align.START} valign={Gtk.Align.CENTER} label={app.name} hexpand vexpand truncate wrap />
            </box>
        </button>
    );
}


function useRef<T>() {
    let ref: T | null = null;

    return {
        set: (r: T) => { ref = r },
        get: () => ref
    }
}

function useApplicationsFilter() {
    const filter = Variable('')

    const list = bind(filter).as((f) => {
        // show all apps by default
        if (!f) return apps.get_list()
        // if the filter is a single character, show all apps that start with that character
        if (f.length === 1) return apps.get_list().filter((app) => app.name.toLowerCase().startsWith(f.toLowerCase()))
        // otherwise, do a fuzzy search (this method wont filter with a single character)
        return apps.fuzzy_query(f)
    })

    return { filter, list }
}

interface ApplicationLauncherProps {
    visible: Variable<boolean>;
    onLaunched?: () => void;
}

const SearchBar = ({ value, setup, onActivate }: { value?: Variable<string>; setup?: (self: Entry) => void; onActivate?: EntryProps['onActivate'] }) => {
    return (
        <box className="notification-menu-controls" expand={false} vertical={false}>
            <box className="menu-label-container notifications" halign={Gtk.Align.START} valign={Gtk.Align.CENTER} expand>
                <entry onActivate={onActivate} setup={setup} className="menu-label notifications" placeholderText="Filter" text={value && bind(value)} onChanged={value && ((entry) => value.set(entry.text))} />
            </box>
            <box halign={Gtk.Align.END} valign={Gtk.Align.CENTER} expand={false}>
                <Separator
                    halign={Gtk.Align.CENTER}
                    vexpand={true}
                    className="menu-separator notification-controls"
                />
                <label className="clear-notifications-label txt-icon" label="" />
            </box>
        </box>
    )
}


const ApplicationLauncher = ({ visible, onLaunched }: ApplicationLauncherProps): JSX.Element => {
    const entry = useRef<Entry>()
    const scrollable = useRef<Scrollable>()

    const { filter, list } = useApplicationsFilter()

    const onFilterReturn = () => {
        const first = list.get()[0]
        if (!first) return;
        launch(first);
        onLaunched?.()
    }

    // focus the entry when the menu is shown
    const onShow = () => {
        entry.get()?.grab_focus()
    }
    visible.subscribe(v => v && onShow());

    const onHide = () => {
        // clear the filter when the menu is hidden
        filter.set('')
        // TODO: reset scroll position
    }
    visible.subscribe(v => !v && onHide);

    return (
        <box className="notification-menu-content" css="padding: 1px; margin: -1px;" hexpand vexpand>
            <box className="notification-card-container menu" hexpand vexpand vertical>
                <SearchBar value={filter} setup={entry.set} onActivate={onFilterReturn} />
                <scrollable vscroll={Gtk.PolicyType.AUTOMATIC} setup={scrollable.set}>
                    <box className="menu-content-container notifications" halign={Gtk.Align.FILL} valign={Gtk.Align.START} spacing={0} vexpand vertical>
                        {list.as(apps => apps.map((app) => <ApplicationItem app={app} onLaunched={onLaunched} />))}
                    </box>
                </scrollable>
            </box>
        </box>
    )
}

/**
 * track the visibility of a window
 * this is necessary because menu are realized at startup and never destroyed
 * making onRealize and onDestroy unreliable for lifecycle management
 */
function useWindowVisibility(windowName: string) {
    const visible = Variable(!!App.get_window(windowName)?.visible);

    App.connect('window-toggled', (_, window) => {
        if (window.name !== windowName) return;
        visible.set(window.visible);
    })

    return visible;
}

export const ApplicationsDropdownMenu = (): JSX.Element => {
    const visible = useWindowVisibility('applicationsdropdownmenu');

    const close = () => App.get_window('applicationsdropdownmenu')?.set_visible(false);

    return (
        <DropdownMenu
            name={'applicationsdropdownmenu'}
            transition={bind(options.menus.transition).as((transition) => RevealerTransitionMap[transition])}
        >
            <ApplicationLauncher visible={visible} onLaunched={close} />
        </DropdownMenu>
    );
};


export const ApplicationsMenu = (): JSX.Element => {
    const visible = useWindowVisibility('applicationsmenu');

    const close = () => App.get_window('applicationsmenu')?.set_visible(false);

    return (
        <PopupWindow name={'applicationsmenu'} transition={bind(options.menus.transition).as((transition) => RevealerTransitionMap[transition])}>
            <ApplicationLauncher visible={visible} onLaunched={close} />
        </PopupWindow>
    )
}