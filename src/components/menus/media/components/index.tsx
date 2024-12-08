import { MediaInfo } from './title/index.js';
import { MediaControls } from './controls/index.js';
import { MediaSlider } from './timebar/index.js';
import { MediaTimeStamp } from './timelabel/index.js';
import { MediaContainer } from './MediaContainer.js';

export const Media = (): JSX.Element => {
    return (
        <MediaContainer>
            <MediaInfo />
            <MediaControls />
            <MediaSlider />
            <MediaTimeStamp />
        </MediaContainer>
    );
};
