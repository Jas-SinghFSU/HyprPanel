import { bind } from 'astal';
import { audioService } from 'src/lib/constants/services';
import { SliderItem } from '../sliderItem/SliderItem';
import { ActiveDeviceMenu } from '..';

const NoStreams = (): JSX.Element => {
    return <label className={'no-playbacks dim'} label={'No active playbacks found.'} expand />;
};

export const ActivePlaybacks = (): JSX.Element => {
    return (
        <box className={'menu-items-section selected'} name={ActiveDeviceMenu.Playbacks} vertical>
            <scrollable className={'menu-scroller active-playbacks-scrollable'}>
                <box vertical>
                    {bind(audioService, 'streams').as((streams) => {
                        if (!streams || streams.length === 0) {
                            return <NoStreams />;
                        }

                        const currentStreams = streams;

                        return currentStreams.map((stream) => {
                            return <SliderItem type={'playback'} device={stream} />;
                        });
                    })}
                </box>
            </scrollable>
        </box>
    );
};
