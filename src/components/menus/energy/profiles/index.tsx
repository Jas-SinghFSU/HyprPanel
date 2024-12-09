import { Gtk } from 'astal/gtk3';
import { powerProfilesService } from 'src/lib/constants/services';
import icons from 'src/lib/icons/icons';
import { uptime } from 'src/lib/variables.js';
import { renderUptime } from './helpers';
import { bind } from 'astal';
import AstalPowerProfiles from 'gi://AstalPowerProfiles?version=0.1';
import { isPrimaryClick } from 'src/lib/utils';

export const EnergyProfiles = (): JSX.Element => {
    type ProfileType = 'balanced' | 'power-saver' | 'performance';

    return (
        <box className="menu-section-container energy" vertical>
            <box className="menu-label-container" halign={Gtk.Align.FILL}>
                <label className="menu-label" label="Power Profile" halign={Gtk.Align.START} hexpand />
                <label className="menu-label uptime" label={bind(uptime).as(renderUptime)} tooltipText="Uptime" />
            </box>
            <box className="menu-items-section" valign={Gtk.Align.FILL} vexpand vertical>
                {powerProfilesService.get_profiles().map((powerProfile: AstalPowerProfiles.Profile) => {
                    const profileType = powerProfile.profile as ProfileType;

                    return (
                        <button
                            className={bind(powerProfilesService, 'activeProfile').as(
                                (active) => `power-profile-item ${active === powerProfile.profile ? 'active' : ''}`,
                            )}
                            onClick={(_, event) => {
                                if (isPrimaryClick(event)) {
                                    powerProfilesService.activeProfile = powerProfile.profile;
                                }
                            }}
                        >
                            <box>
                                <icon className="power-profile-icon" icon={icons.powerprofile[profileType]} />
                                <label className="power-profile-label" label={profileType} />
                            </box>
                        </button>
                    );
                })}
            </box>
        </box>
    );
};
