import { openMenu } from '../../utils/menu';
import options from 'src/options';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, GLib, Variable } from 'astal';
import { useHook } from 'src/lib/shared/hookHandler';
import {
    connectMiddleClick,
    connectPrimaryClick,
    connectScroll,
    connectSecondaryClick,
} from 'src/lib/shared/eventHandlers';

const { format, icon, showIcon, showTime, rightClick, middleClick, scrollUp, scrollDown } = options.bar.clock;
const { style } = options.theme.bar.buttons;

// const date = Variable(GLib.DateTime.new_now_local(), {
//     poll: [1000, (): DateTime => GLib.DateTime.new_now_local()],
// });
const date = Variable(GLib.DateTime.new_now_local()).poll(1000, (): GLib.DateTime => GLib.DateTime.new_now_local());
const time = Variable.derive([date, format], (c, f) => c.format(f) || '');

const Clock = (): BarBoxChild => {
    const clockTime = <label className={'bar-button-label clock bar'} label={bind(time)} />;
    const clockIcon = <label className={'bar-button-icon clock txt-icon bar'} label={bind(icon)} />;

    const componentClassName = Variable.derive(
        [bind(style), bind(showIcon), bind(showTime)],
        (btnStyle, shwIcn, shwLbl) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `clock-container ${styleMap[btnStyle]} ${!shwLbl ? 'no-label' : ''} ${!shwIcn ? 'no-icon' : ''}`;
        },
    );

    const componentChildren = Variable.derive([bind(showIcon), bind(showTime)], (shIcn, shTm) => {
        if (shIcn && !shTm) {
            return [clockIcon];
        } else if (shTm && !shIcn) {
            return [clockTime];
        }
        return [clockIcon, clockTime];
    });
    const component = <box className={componentClassName()}>{componentChildren()}</box>;

    return {
        component,
        isVisible: true,
        boxClass: 'clock',
        props: {
            setup: (self: GtkWidget): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    const disconnectPrimary = connectPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'calendarmenu');
                    });

                    const disconnectSecondary = connectSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    });

                    const disconnectMiddle = connectMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    });

                    const disconnectScroll = connectScroll(self, throttledHandler, scrollUp.value, scrollDown.value);

                    return (): void => {
                        disconnectPrimary();
                        disconnectSecondary();
                        disconnectMiddle();
                        disconnectScroll();
                    };
                });
            },
        },
    };
};

export { Clock };
