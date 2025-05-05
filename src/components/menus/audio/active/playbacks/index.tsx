import { bind } from 'astal';
import { SliderItem } from '../sliderItem/SliderItem';
import { ActiveDeviceMenu } from '..';
import AstalWp from 'gi://AstalWp?version=0.1';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber.audio;

const NoStreams = (): JSX.Element => {
    return <label className={'no-playbacks dim'} label={'No active playbacks found.'} expand />;
};

export const ActivePlaybacks = (): JSX.Element => {
    return (
        <box className={'menu-items-section selected'} name={ActiveDeviceMenu.PLAYBACKS} vertical>
            <scrollable className={'menu-scroller active-playbacks-scrollable'}>
                <box vertical>
                    {bind(audioService, 'streams').as((streams) => {
                        if (streams === null || streams.length === 0) {
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
