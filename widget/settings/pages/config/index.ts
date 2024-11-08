import options from 'options';
import { GBox } from 'lib/types/widget';
import { ConfigPage, configPages } from './helpers';
import { pageList } from 'widget/settings/helpers';

const { transition, transitionTime } = options.menus;

const CurrentPage = Variable<ConfigPage>('General');

export const SettingsMenu = (): GBox => {
    return Widget.Box({
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'option-pages-container',
                hpack: 'center',
                hexpand: true,
                children: pageList(configPages).map((page) => {
                    return Widget.Button({
                        hpack: 'center',
                        class_name: CurrentPage.bind('value').as((v) => `pager-button ${v === page ? 'active' : ''}`),
                        label: page,
                        on_primary_click: () => (CurrentPage.value = page),
                    });
                }),
            }),
            Widget.Stack({
                vexpand: true,
                transition: transition.bind('value'),
                transitionDuration: transitionTime.bind('value'),
                class_name: 'themes-menu-stack',
                children: configPages,
                shown: CurrentPage.bind('value'),
            }),
        ],
    });
};
