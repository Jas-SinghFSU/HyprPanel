import { openMenu } from '../../utils/menu';
import options from 'src/options';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { useHook } from 'src/lib/shared/hookHandler';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers';
import { Astal } from 'astal/gtk3';
import { systemTime } from 'src/globals/time';

const { format, icon, showIcon, showTime, rightClick, middleClick, scrollUp, scrollDown } = options.bar.clock;
const { style } = options.theme.bar.buttons;

const time = Variable.derive([systemTime, format], (c, f) => c.format(f) || '');

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

    const component = (
        <box
            className={componentClassName()}
            onDestroy={() => {
                componentClassName.drop();
                componentChildren.drop();
            }}
        >
            {componentChildren()}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'clock',
        props: {
            setup: (self: Astal.Button): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'calendarmenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.get(), { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.get(), { clicked, event });
                    });

                    const disconnectScroll = onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get());

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
