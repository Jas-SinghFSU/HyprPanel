import options from 'src/options';
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { StackTransitionMap } from 'src/lib/constants/options';
import { MenuTheme } from './menus';
import { Matugen } from './menus/matugen';
import { BarTheme } from './bar';
import { NotificationsTheme } from './notifications';
import { OsdTheme } from './osd';
import { BatteryMenuTheme } from './menus/battery';
import { BluetoothMenuTheme } from './menus/bluetooth';
import { ClockMenuTheme } from './menus/clock';
import { DashboardMenuTheme } from './menus/dashboard';
import { MediaMenuTheme } from './menus/media';
import { NetworkMenuTheme } from './menus/network';
import { NotificationsMenuTheme } from './menus/notifications';
import { SystrayMenuTheme } from './menus/systray';
import { VolumeMenuTheme } from './menus/volume';
import { PowerMenuTheme } from './menus/power';
import { CustomModuleTheme } from 'src/components/bar/settings/theme';
import { ThemePage, themePages } from '../../helpers';

const { transition, transitionTime } = options.menus;

const CurrentPage = Variable<ThemePage>('General Settings');

export const ThemesMenu = (): JSX.Element => {
    return (
        <box name={'Theming'} halign={Gtk.Align.FILL} hexpand vertical>
            <box className="option-pages-container" halign={Gtk.Align.CENTER} hexpand vertical>
                {[0, 1, 2].map((section) => {
                    return (
                        <box>
                            {themePages.map((page, index) => {
                                if (index >= section * 6 && index < section * 6 + 6) {
                                    return (
                                        <button
                                            className={bind(CurrentPage).as(
                                                (pg) => `pager-button ${pg === page ? 'active' : ''}`,
                                            )}
                                            label={page}
                                            onClick={(_, event) => {
                                                if (isPrimaryClick(event)) {
                                                    CurrentPage.set(page as ThemePage);
                                                }
                                            }}
                                            halign={Gtk.Align.CENTER}
                                        />
                                    );
                                }

                                return <box />;
                            })}
                        </box>
                    );
                })}
            </box>
            <stack
                className="themes-menu-stack"
                transitionType={bind(transition).as((transitionType) => StackTransitionMap[transitionType])}
                transitionDuration={bind(transitionTime)}
                shown={bind(CurrentPage)}
                vexpand={false}
            >
                <MenuTheme />
                <Matugen />
                <BarTheme />
                <NotificationsTheme />
                <OsdTheme />
                <BatteryMenuTheme />
                <BluetoothMenuTheme />
                <ClockMenuTheme />
                <DashboardMenuTheme />
                <MediaMenuTheme />
                <NetworkMenuTheme />
                <NotificationsMenuTheme />
                <SystrayMenuTheme />
                <VolumeMenuTheme />
                <PowerMenuTheme />
                <CustomModuleTheme />
            </stack>
        </box>
    );
};
