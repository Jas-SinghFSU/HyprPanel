import { Gtk } from 'astal/gtk3';
import { LeftSection, RightSection } from './Sections';
import { LeftLink1, LeftLink2, LeftLink3, RightLink1, RightLink2, RightLink3 } from './DirectoryLinks';

export const Directories = ({ isEnabled }: DirectoriesProps): JSX.Element => {
    if (!isEnabled) {
        return <box />;
    }

    return (
        <box className={'dashboard-card directories-container'} valign={Gtk.Align.FILL} halign={Gtk.Align.FILL} expand>
            <LeftSection>
                <LeftLink1 />
                <LeftLink2 />
                <LeftLink3 />
            </LeftSection>
            <RightSection>
                <RightLink1 />
                <RightLink2 />
                <RightLink3 />
            </RightSection>
        </box>
    );
};

interface DirectoriesProps {
    isEnabled: boolean;
}
