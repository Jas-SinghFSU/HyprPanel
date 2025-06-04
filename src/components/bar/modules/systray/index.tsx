import AstalTray from 'gi://AstalTray?version=0.1';
import { bind, Gio, Variable } from 'astal';
import { Gdk, Gtk } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import options from 'src/configuration';
import { isPrimaryClick, isSecondaryClick, isMiddleClick } from 'src/lib/events/mouse';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

const systemtray = AstalTray.get_default();
const { ignore, customIcons } = options.bar.systray;

const createMenu = (menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup | null): Gtk.Menu => {
    const menu = Gtk.Menu.new_from_model(menuModel);
    menu.insert_action_group('dbusmenu', actionGroup);

    return menu;
};

const MenuCustomIcon = ({ iconLabel, iconColor, iconSize, item }: MenuCustomIconProps): JSX.Element => {
    return (
        <label
            className={'systray-icon txt-icon'}
            label={iconLabel}
            css={iconColor ? `color: ${iconColor}; font-size: ${iconSize}` : ''}
            tooltipMarkup={bind(item, 'tooltipMarkup')}
        />
    );
};

const MenuDefaultIcon = ({ item }: MenuEntryProps): JSX.Element => {
    return (
        <icon
            className={'systray-icon'}
            gicon={bind(item, 'gicon')}
            tooltipMarkup={bind(item, 'tooltipMarkup')}
        />
    );
};

const MenuEntry = ({ item, child }: MenuEntryProps): JSX.Element => {
    let menu: Gtk.Menu;

    const entryBinding = Variable.derive(
        [bind(item, 'menuModel'), bind(item, 'actionGroup')],
        (menuModel, actionGroup) => {
            if (menuModel === null) {
                return console.error(`Menu Model not found for ${item.id}`);
            }
            if (actionGroup === null) {
                return console.error(`Action Group not found for ${item.id}`);
            }

            menu = createMenu(menuModel, actionGroup);
        },
    );

    return (
        <button
            cursor={'pointer'}
            onClick={(self, event) => {
                if (isPrimaryClick(event)) {
                    item.activate(0, 0);
                }

                if (isSecondaryClick(event)) {
                    menu?.popup_at_widget(self, Gdk.Gravity.NORTH, Gdk.Gravity.SOUTH, null);
                }

                if (isMiddleClick(event)) {
                    SystemUtilities.notify({ summary: 'App Name', body: item.id });
                }
            }}
            onDestroy={() => {
                menu?.destroy();
                entryBinding.drop();
            }}
        >
            {child}
        </button>
    );
};

const SysTray = (): BarBoxChild => {
    const isVis = Variable(false);

    const componentChildren = Variable.derive(
        [bind(systemtray, 'items'), bind(ignore), bind(customIcons)],
        (items, ignored, custIcons) => {
            const filteredTray = items.filter(({ id }) => !ignored.includes(id) && id !== null);

            isVis.set(filteredTray.length > 0);

            return filteredTray.map((item) => {
                const matchedCustomIcon = Object.keys(custIcons).find((iconRegex) =>
                    item.id.match(iconRegex),
                );

                if (matchedCustomIcon !== undefined) {
                    const iconLabel = custIcons[matchedCustomIcon].icon || '󰠫';
                    const iconColor = custIcons[matchedCustomIcon].color;
                    const iconSize = custIcons[matchedCustomIcon].size || '1.3em';

                    return (
                        <MenuEntry item={item}>
                            <MenuCustomIcon
                                iconLabel={iconLabel}
                                iconColor={iconColor}
                                iconSize={iconSize}
                                item={item}
                            />
                        </MenuEntry>
                    );
                }
                return (
                    <MenuEntry item={item}>
                        <MenuDefaultIcon item={item} />
                    </MenuEntry>
                );
            });
        },
    );

    const component = (
        <box
            className={'systray-container'}
            onDestroy={() => {
                isVis.drop();
                componentChildren.drop();
            }}
        >
            {componentChildren()}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'systray',
        isVis: bind(isVis),
        isBox: true,
        props: {},
    };
};

interface MenuCustomIconProps {
    iconLabel: string;
    iconColor: string;
    iconSize: string;
    item: AstalTray.TrayItem;
}

interface MenuEntryProps {
    item: AstalTray.TrayItem;
    child?: JSX.Element;
}

export { SysTray };
