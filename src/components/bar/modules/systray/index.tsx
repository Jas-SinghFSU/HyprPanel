import { Notify } from '../../../../lib/utils';
import options from '../../../../options';
import AstalTray from 'gi://AstalTray?version=0.1';
import { GtkWidget } from '../../../../lib/types/widget';
import { bind, Variable } from 'astal';
import { onMiddleClick, onPrimaryClick, onSecondaryClick } from 'src/lib/shared/eventHandlers';
import { BarBoxChild } from 'src/lib/types/bar';

const systemtray = AstalTray.get_default();
const { ignore, customIcons } = options.bar.systray;

const SysTray = (): BarBoxChild => {
    const isVis = Variable(false);

    const customIcon = (iconLabel: string, iconColor: string, item: AstalTray.TrayItem): GtkWidget => {
        const menu = item.create_menu();

        return (
            <button
                cursor={'pointer'}
                setup={(self) => {
                    onPrimaryClick(self, () => item.activate(0, 0));
                    onSecondaryClick(self, (_, event) => menu?.popup_at_pointer(event));
                    onMiddleClick(self, () => Notify({ summary: 'App Name', body: item.id }));
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
                onClick={(_, self) => {}}
                setup={(self) => {
                    onPrimaryClick(self, () => item.activate(0, 0));
                    onSecondaryClick(self, (_, event) => menu?.popup_at_pointer(event));
                    onMiddleClick(self, () => Notify({ summary: 'App Name', body: item.id }));
                }}
                onScroll={(_, self: string) => {}}
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
    const component = <box className={'systray-container'}>{componentChildren()}</box>;

    return {
        component,
        isVisible: true,
        boxClass: 'systray',
        isVis,
        props: {},
    };
};

export { SysTray };
