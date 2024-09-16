import RegularWindow from 'widget/RegularWindow';
import icons from 'lib/icons';
import options from 'options';
import { ThemesMenu } from './pages/theme/index';
import { SettingsMenu } from './pages/config/index';
import './side_effects';
import { GBox, GCenterBox } from 'lib/types/widget';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';

type Page = 'Configuration' | 'Theming';

const CurrentPage = Variable<Page>('Configuration');

const pagerMap: Page[] = ['Configuration', 'Theming'];

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
        children: CurrentPage.bind('value').as((v) => {
            return [
                Widget.Box({
                    class_name: 'option-pages-container',
                    hpack: 'center',
                    hexpand: true,
                    children: pagerMap.map((page) => {
                        return Widget.Button({
                            xalign: 0,
                            hpack: 'center',
                            class_name: `pager-button ${v === page ? 'active' : ''} category`,
                            label: page,
                            on_primary_click: () => (CurrentPage.value = page),
                        });
                    }),
                }),
                Widget.Stack({
                    vexpand: false,
                    class_name: 'themes-menu-stack',
                    children: {
                        Configuration: SettingsMenu(),
                        Theming: ThemesMenu(),
                    },
                    shown: CurrentPage.bind('value'),
                }),
            ];
        }),
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
