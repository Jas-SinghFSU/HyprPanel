import { BoxWidget } from 'lib/types/widget';
import options from 'options';

const { left, right } = options.menus.dashboard.directories;

const Directories = (): BoxWidget => {
    return Widget.Box({
        class_name: 'dashboard-card directories-container',
        vpack: 'fill',
        hpack: 'fill',
        expand: true,
        children: [
            Widget.Box({
                vertical: true,
                expand: true,
                class_name: 'section right',
                children: [
                    Widget.Button({
                        hpack: 'start',
                        expand: true,
                        class_name: 'directory-link left top',
                        on_primary_click: left.directory1.command.bind('value').as((cmd) => {
                            return () => {
                                App.closeWindow('dashboardmenu');
                                Utils.execAsync(cmd);
                            };
                        }),
                        child: Widget.Label({
                            hpack: 'start',
                            label: left.directory1.label.bind('value'),
                        }),
                    }),
                    Widget.Button({
                        expand: true,
                        hpack: 'start',
                        class_name: 'directory-link left middle',
                        on_primary_click: left.directory2.command.bind('value').as((cmd) => {
                            return () => {
                                App.closeWindow('dashboardmenu');
                                Utils.execAsync(cmd);
                            };
                        }),
                        child: Widget.Label({
                            hpack: 'start',
                            label: left.directory2.label.bind('value'),
                        }),
                    }),
                    Widget.Button({
                        expand: true,
                        hpack: 'start',
                        class_name: 'directory-link left bottom',
                        on_primary_click: left.directory3.command.bind('value').as((cmd) => {
                            return () => {
                                App.closeWindow('dashboardmenu');
                                Utils.execAsync(cmd);
                            };
                        }),
                        child: Widget.Label({
                            hpack: 'start',
                            label: left.directory3.label.bind('value'),
                        }),
                    }),
                ],
            }),
            Widget.Box({
                vertical: true,
                expand: true,
                class_name: 'section left',
                children: [
                    Widget.Button({
                        hpack: 'start',
                        expand: true,
                        class_name: 'directory-link right top',
                        on_primary_click: right.directory1.command.bind('value').as((cmd) => {
                            return () => {
                                App.closeWindow('dashboardmenu');
                                Utils.execAsync(cmd);
                            };
                        }),
                        child: Widget.Label({
                            hpack: 'start',
                            label: right.directory1.label.bind('value'),
                        }),
                    }),
                    Widget.Button({
                        expand: true,
                        hpack: 'start',
                        class_name: 'directory-link right middle',
                        on_primary_click: right.directory2.command.bind('value').as((cmd) => {
                            return () => {
                                App.closeWindow('dashboardmenu');
                                Utils.execAsync(cmd);
                            };
                        }),
                        child: Widget.Label({
                            hpack: 'start',
                            label: right.directory2.label.bind('value'),
                        }),
                    }),
                    Widget.Button({
                        expand: true,
                        hpack: 'start',
                        class_name: 'directory-link right bottom',
                        on_primary_click: right.directory3.command.bind('value').as((cmd) => {
                            return () => {
                                App.closeWindow('dashboardmenu');
                                Utils.execAsync(cmd);
                            };
                        }),
                        child: Widget.Label({
                            hpack: 'start',
                            label: right.directory3.label.bind('value'),
                        }),
                    }),
                ],
            }),
        ],
    });
};

export { Directories };
