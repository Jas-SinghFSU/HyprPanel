import { isMiddleClick, isPrimaryClick, isSecondaryClick, Notify } from '../../../../lib/utils';
import options from '../../../../options';
import AstalTray from 'gi://AstalTray?version=0.1';
import { GtkWidget } from '../../../../lib/types/widget';
import { bind, Variable } from 'astal';
import { BarBoxChild } from 'src/lib/types/bar';
import { Gdk } from 'astal/gtk3';

const systemtray = AstalTray.get_default();
const { ignore, customIcons } = options.bar.systray;

const SysTray = (): BarBoxChild => {
    const isVis = Variable(false);

    const customIcon = (iconLabel: string, iconColor: string, item: AstalTray.TrayItem): GtkWidget => {
        const menu = item.create_menu();

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
                        Notify({ summary: 'App Name', body: item.id });
                    }
                }}
                onDestroy={() => {
                    isVis.drop();
                }}
            >
                <label
                    className={'systray-icon txt-icon'}
                    label={iconLabel}
                    css={iconColor ? `color: ${iconColor}` : ''}
                    tooltipMarkup={bind(item, 'tooltipMarkup')}
                />
            </button>
        );
    };

    const defaultIcon = (item: AstalTray.TrayItem): GtkWidget => {
        const menu = item.create_menu();

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
                        Notify({ summary: 'App Name', body: item.id });
                    }
                }}
            >
                <icon
                    className={'systray-icon'}
                    gIcon={bind(item, 'gicon')}
                    tooltipMarkup={bind(item, 'tooltipMarkup')}
                />
            </button>
        );
    };

    const componentChildren = Variable.derive(
        [bind(systemtray, 'items'), bind(ignore), bind(customIcons)],
        (items, ignored, custIcons) => {
            const filteredTray = items.filter(({ id }) => !ignored.includes(id) && id !== null);

            isVis.set(filteredTray.length > 0);

            return filteredTray.map((item) => {
                const matchedCustomIcon = Object.keys(custIcons).find((iconRegex) => item.id.match(iconRegex));

                if (matchedCustomIcon !== undefined) {
                    const iconLabel = custIcons[matchedCustomIcon].icon || '󰠫';
                    const iconColor = custIcons[matchedCustomIcon].color;

                    return customIcon(iconLabel, iconColor, item);
                }

                return defaultIcon(item);
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
        isVis,
        props: {},
    };
};

export { SysTray };
