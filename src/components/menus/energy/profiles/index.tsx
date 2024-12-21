import { PowerProfileHeader } from './Header';
import { PowerProfiles } from './Profile';

export const EnergyProfiles = (): JSX.Element => {
    return (
        <box className="menu-section-container energy" vertical>
            <PowerProfileHeader />
            <PowerProfiles />
        </box>
    );
};
