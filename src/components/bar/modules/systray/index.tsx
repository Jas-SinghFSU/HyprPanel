import options from '../../../../options';
import AstalTray from 'gi://AstalTray?version=0.1';
import { bind, Variable } from 'astal';
import { BarBoxChild } from 'src/lib/types/bar';
import { BindableChild } from 'astal/gtk3/astalify';

const systemtray = AstalTray.get_default();
const { ignore, customIcons } = options.bar.systray;

const SysTray = (): BarBoxChild => {
    const isVis = Variable(false);

    const MenuContainer = ({ item, child }: MenuContainerProps): JSX.Element => {
        return (
            <menubutton
                tooltipMarkup={bind(item, 'tooltipMarkup')}
                usePopover={false}
                actionGroup={bind(item, 'action-group').as((ag) => ['dbusmenu', ag])}
                menuModel={bind(item, 'menu-model')}
                onButtonPressEvent={() => {
                    log('button press');
                }}
            >
                {child}
            </menubutton>
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

                    return (
                        <MenuContainer item={item}>
                            <label
                                className={'systray-icon txt-icon'}
                                label={iconLabel}
                                css={iconColor ? `color: ${iconColor}` : ''}
                                tooltipMarkup={bind(item, 'tooltipMarkup')}
                            />
                        </MenuContainer>
                    );
                }
                return (
                    <MenuContainer item={item}>
                        <icon
                            className={'systray-icon'}
                            gIcon={bind(item, 'gicon')}
                            tooltipMarkup={bind(item, 'tooltipMarkup')}
                        />
                    </MenuContainer>
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
        isVis,
        isBox: true,
        props: {},
    };
};

interface MenuContainerProps {
    item: AstalTray.TrayItem;
    child?: BindableChild;
}

export { SysTray };
