import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalPowerProfiles from 'gi://AstalPowerProfiles?version=0.1';
import { isPrimaryClick } from 'src/lib/events/mouse';
import icons from 'src/lib/icons/icons';
import { ProfileType } from './types';

export const PowerProfiles = (): JSX.Element => {
    const powerProfilesService = AstalPowerProfiles.get_default();
    const powerProfiles = powerProfilesService.get_profiles();

    return (
        <box className="menu-items-section" valign={Gtk.Align.FILL} vexpand vertical>
            {powerProfiles.map((powerProfile: AstalPowerProfiles.Profile) => {
                const profileType = powerProfile.profile as ProfileType;

                return (
                    <button
                        className={bind(powerProfilesService, 'activeProfile').as(
                            (active) =>
                                `power-profile-item ${active === powerProfile.profile ? 'active' : ''}`,
                        )}
                        onClick={(_, event) => {
                            if (isPrimaryClick(event)) {
                                powerProfilesService.activeProfile = powerProfile.profile;
                            }
                        }}
                    >
                        <box>
                            <icon
                                className="power-profile-icon"
                                icon={icons.powerprofile[profileType] || icons.powerprofile.balanced}
                            />
                            <label className="power-profile-label" label={profileType} />
                        </box>
                    </button>
                );
            })}
        </box>
    );
};
