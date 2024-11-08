import RegularWindow from 'widget/RegularWindow';
import icons from 'lib/icons';
import options from 'options';
import './side_effects';
import { GBox, GCenterBox } from 'lib/types/widget';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';
import { pageList } from 'widget/settings/helpers';
import { SettingsPage, settingsPages } from './settingsPages';

const { transition, transitionTime } = options.menus;

const CurrentPage = Variable<SettingsPage>('Configuration');
const LastPage = Variable<SettingsPage>('Configuration');

const Header = (): GCenterBox =>
    Widget.CenterBox({
        class_name: 'header',
        start_widget: Widget.Button({
            class_name: 'reset',
            on_clicked: options.reset,
            hpack: 'start',
            vpack: 'start',
            child: Widget.Icon(icons.ui.refresh),
            tooltip_text: 'Reset',
        }),
        center_widget: Widget.Box({}),
        end_widget: Widget.Button({
            class_name: 'close',
            hpack: 'end',
            vpack: 'start',
            child: Widget.Icon(icons.ui.close),
            on_clicked: () => App.closeWindow('settings-dialog'),
        }),
    });

const PageContainer = (): GBox => {
    return Widget.Box({
        hpack: 'fill',
        hexpand: true,
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'option-pages-container',
                hpack: 'center',
                hexpand: true,
                children: pageList(settingsPages).map((page) => {
                    return Widget.Button({
                        xalign: 0,
                        hpack: 'center',
                        class_name: CurrentPage.bind('value').as(
                            (v) => `pager-button ${v === page ? 'active' : ''} category`,
                        ),
                        label: page,
                        on_primary_click: () => {
                            LastPage.value = CurrentPage.value;
                            CurrentPage.value = page;
                        },
                    });
                }),
            }),
            Widget.Stack({
                vexpand: false,
                transition: transition.bind('value'),
                transitionDuration: transitionTime.bind('value'),
                class_name: 'themes-menu-stack',
                children: settingsPages,
                shown: CurrentPage.bind('value'),
            }),
        ],
    });
};

export default (): Gtk.Window =>
    RegularWindow({
        name: 'settings-dialog',
        class_name: 'settings-dialog',
        title: 'Settings',
        setup(win) {
            win.on('delete-event', () => {
                win.hide();
                return true;
            });
            win.set_default_size(200, 300);
        },
        child: Widget.Box({
            class_name: 'settings-dialog-box',
            vertical: true,
            children: [Header(), PageContainer()],
        }),
    });
