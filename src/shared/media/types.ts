import { Variable } from 'astal';
import AstalMpris from 'gi://AstalMpris?version=0.1';

export interface MediaSubscriptions {
    position: Variable<void> | undefined;
    loop: Variable<void> | undefined;
    shuffle: Variable<void> | undefined;
    canPlay: Variable<void> | undefined;
    playbackStatus: Variable<void> | undefined;
    canGoNext: Variable<void> | undefined;
    canGoPrevious: Variable<void> | undefined;
    title: Variable<void> | undefined;
    album: Variable<void> | undefined;
    artist: Variable<void> | undefined;
    artUrl: Variable<void> | undefined;
}

export type MediaSubscriptionNames = keyof MediaSubscriptions;

export type CurrentPlayer = AstalMpris.Player | undefined;
