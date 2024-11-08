import options from 'options';
import { GBox } from 'lib/types/widget';
import { ThemePage, themePages } from './helpers';
import { pageList } from 'widget/settings/helpers';

const { transition, transitionTime } = options.menus;

const CurrentPage = Variable<ThemePage>('General Settings');

export const ThemesMenu = (): GBox => {
    return Widget.Box({
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'option-pages-container',
                hpack: 'center',
                hexpand: true,
                vertical: true,
                children: [0, 1, 2].map((section) => {
                    return Widget.Box({
                        children: pageList(themePages).map((page, index) => {
                            if (index >= section * 6 && index < section * 6 + 6) {
                                return Widget.Button({
                                    hpack: 'center',
                                    xalign: 0,
                                    class_name: CurrentPage.bind('value').as(
                                        (v) => `pager-button ${v === page ? 'active' : ''}`,
                                    ),
                                    label: page,
                                    on_primary_click: () => (CurrentPage.value = page),
                                });
                            }
                            return Widget.Box();
                        }),
                    });
                }),
            }),
            Widget.Stack({
                vexpand: true,
                transition: transition.bind('value'),
                transitionDuration: transitionTime.bind('value'),
                class_name: 'themes-menu-stack',
                children: themePages,
                shown: CurrentPage.bind('value'),
            }),
        ],
    });
};
