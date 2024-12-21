import { bind, Variable } from 'astal';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { getTimeStamp } from 'src/components/menus/media/components/timebar/helpers';
import { mprisService } from 'src/lib/constants/services';
import options from 'src/options';

const { noMediaText } = options.menus.media;

export const activePlayer = Variable<AstalMpris.Player | undefined>(undefined);

const forceUpdate = Variable(false);

mprisService.connect('player-closed', (_, closedPlayer) => {
    if (mprisService.get_players().length === 1 && closedPlayer.busName === mprisService.get_players()[0]?.busName) {
        return activePlayer.set(undefined);
    }

    if (closedPlayer.busName === activePlayer.get()?.busName) {
        const nextPlayer = mprisService.get_players().find((player) => player.busName !== closedPlayer.busName);
        activePlayer.set(nextPlayer);
    }
});

mprisService.connect('player-added', (_, addedPlayer) => {
    if (activePlayer.get() === undefined) {
        activePlayer.set(addedPlayer);
    }
});

export const timeStamp = Variable('00:00');
export const currentPosition = Variable(0);

export const loopStatus = Variable(AstalMpris.Loop.NONE);
export const shuffleStatus = Variable(AstalMpris.Shuffle.OFF);

export const canPlay = Variable(false);
export const playbackStatus = Variable(AstalMpris.PlaybackStatus.STOPPED);

export const canGoNext = Variable(false);
export const canGoPrevious = Variable(false);

export const mediaTitle = Variable(noMediaText.get());
export const mediaAlbum = Variable('-----');
export const mediaArtist = Variable('-----');
export const mediaArtUrl = Variable('');

let positionUnsub: Variable<void>;

let loopUnsub: Variable<void>;
let shuffleUnsub: Variable<void>;

let canPlayUnsub: Variable<void>;
let playbackStatusUnsub: Variable<void>;

let canGoNextUnsub: Variable<void>;
let canGoPreviousUnsub: Variable<void>;

let titleUnsub: Variable<void>;
let albumUnsub: Variable<void>;
let artistUnsub: Variable<void>;
let artUrlUnsub: Variable<void>;

const updatePosition = (player: AstalMpris.Player | undefined): void => {
    if (positionUnsub) {
        positionUnsub();
        positionUnsub.drop();
    }

    if (player === undefined) {
        timeStamp.set('00:00');
        currentPosition.set(0);
        return;
    }

    const loopBinding = bind(player, 'position');

    positionUnsub = Variable.derive([bind(loopBinding), bind(player, 'playbackStatus')], (pos) => {
        if (player?.length > 0) {
            timeStamp.set(getTimeStamp(pos, player.length));
            currentPosition.set(pos);
        } else {
            timeStamp.set('00:00');
            currentPosition.set(0);
        }
    });

    const initialPos = loopBinding.get();

    timeStamp.set(getTimeStamp(initialPos, player.length));
    currentPosition.set(initialPos);
};

const updateLoop = (player: AstalMpris.Player | undefined): void => {
    if (loopUnsub) {
        loopUnsub();
        loopUnsub.drop();
    }

    if (player === undefined) {
        loopStatus.set(AstalMpris.Loop.NONE);
        return;
    }

    const loopBinding = bind(player, 'loopStatus');

    loopUnsub = Variable.derive([bind(loopBinding), bind(player, 'playbackStatus')], (status) => {
        if (player?.length > 0) {
            loopStatus.set(status);
        } else {
            currentPosition.set(AstalMpris.Loop.NONE);
        }
    });

    const initialStatus = loopBinding.get();

    loopStatus.set(initialStatus);
};

const updateShuffle = (player: AstalMpris.Player | undefined): void => {
    if (shuffleUnsub) {
        shuffleUnsub();
        shuffleUnsub.drop();
    }

    if (player === undefined) {
        shuffleStatus.set(AstalMpris.Shuffle.OFF);
        return;
    }

    const shuffleBinding = bind(player, 'shuffleStatus');

    shuffleUnsub = Variable.derive([bind(shuffleBinding), bind(player, 'playbackStatus')], (status) => {
        shuffleStatus.set(status ?? AstalMpris.Shuffle.OFF);
    });

    const initialStatus = shuffleBinding.get();
    shuffleStatus.set(initialStatus);
};

const updateCanPlay = (player: AstalMpris.Player | undefined): void => {
    if (canPlayUnsub) {
        canPlayUnsub();
        canPlayUnsub.drop();
    }

    if (player === undefined) {
        canPlay.set(false);
        return;
    }

    const canPlayBinding = bind(player, 'canPlay');

    canPlayUnsub = Variable.derive([canPlayBinding, bind(player, 'playbackStatus')], (playable) => {
        canPlay.set(playable ?? false);
    });

    const initialCanPlay = canPlay.get();
    canPlay.set(initialCanPlay);
};

const updatePlaybackStatus = (player: AstalMpris.Player | undefined): void => {
    if (playbackStatusUnsub) {
        playbackStatusUnsub();
        playbackStatusUnsub.drop();
    }

    if (player === undefined) {
        playbackStatus.set(AstalMpris.PlaybackStatus.STOPPED);
        return;
    }

    const playbackStatusBinding = bind(player, 'playbackStatus');

    playbackStatusUnsub = Variable.derive([playbackStatusBinding], (status) => {
        playbackStatus.set(status ?? AstalMpris.PlaybackStatus.STOPPED);
    });

    const initialStatus = playbackStatus.get();

    playbackStatus.set(initialStatus);
};

const updateCanGoNext = (player: AstalMpris.Player | undefined): void => {
    if (canGoNextUnsub) {
        canGoNextUnsub();
        canGoNextUnsub.drop();
    }

    if (player === undefined) {
        canGoNext.set(false);
        return;
    }

    const canGoNextBinding = bind(player, 'canGoNext');

    canGoNextUnsub = Variable.derive([canGoNextBinding, bind(player, 'playbackStatus')], (canNext) => {
        canGoNext.set(canNext ?? false);
    });

    const initialCanNext = canGoNext.get();
    canGoNext.set(initialCanNext);
};

const updateCanGoPrevious = (player: AstalMpris.Player | undefined): void => {
    if (canGoPreviousUnsub) {
        canGoPreviousUnsub();
        canGoPreviousUnsub.drop();
    }

    if (player === undefined) {
        canGoPrevious.set(false);
        return;
    }

    const canGoPreviousBinding = bind(player, 'canGoPrevious');

    canGoPreviousUnsub = Variable.derive([canGoPreviousBinding, bind(player, 'playbackStatus')], (canPrev) => {
        canGoPrevious.set(canPrev ?? false);
    });

    const initialCanPrev = canGoPrevious.get();
    canGoPrevious.set(initialCanPrev);
};

const updateTitle = (player: AstalMpris.Player | undefined): void => {
    if (titleUnsub) {
        titleUnsub();
        titleUnsub.drop();
    }

    if (player === undefined) {
        mediaTitle.set(noMediaText.get());
        return;
    }

    const titleBinding = bind(player, 'title');

    titleUnsub = Variable.derive([titleBinding, bind(player, 'playbackStatus')], (newTitle, pbStatus) => {
        if (pbStatus === AstalMpris.PlaybackStatus.STOPPED) {
            return mediaTitle.set(noMediaText.get() ?? '-----');
        }

        mediaTitle.set(newTitle.length > 0 ? newTitle : '-----');
    });

    const initialTitle = mediaTitle.get();
    mediaTitle.set(initialTitle.length > 0 ? initialTitle : '-----');
};

const updateAlbum = (player: AstalMpris.Player | undefined): void => {
    if (albumUnsub) {
        albumUnsub();
        albumUnsub.drop();
    }

    if (player === undefined) {
        mediaAlbum.set('-----');
        return;
    }

    albumUnsub = Variable.derive([bind(player, 'album'), bind(player, 'playbackStatus')], (newAlbum) => {
        mediaAlbum.set(newAlbum?.length > 0 ? newAlbum : '-----');
    });

    const initialAlbum = mediaAlbum.get();
    mediaAlbum.set(initialAlbum.length > 0 ? initialAlbum : '-----');
};

const updateArtist = (player: AstalMpris.Player | undefined): void => {
    if (artistUnsub) {
        artistUnsub();
        artistUnsub.drop();
    }

    if (player === undefined) {
        mediaArtist.set('-----');
        return;
    }

    const artistBinding = bind(player, 'artist');

    artistUnsub = Variable.derive([artistBinding, bind(player, 'playbackStatus')], (newArtist) => {
        mediaArtist.set(newArtist?.length > 0 ? newArtist : '-----');
    });

    const initialArtist = mediaArtist.get();
    mediaArtist.set(initialArtist?.length > 0 ? initialArtist : '-----');
};

const updateArtUrl = (player: AstalMpris.Player | undefined): void => {
    if (artUrlUnsub) {
        artUrlUnsub();
        artUrlUnsub.drop();
    }

    if (player === undefined) {
        mediaArtUrl.set('');
        return;
    }

    const artUrlBinding = bind(player, 'artUrl');

    artUrlUnsub = Variable.derive([artUrlBinding, bind(player, 'playbackStatus')], (newArtUrl) => {
        mediaArtUrl.set(newArtUrl ?? '');
    });

    const initialArtUrl = mediaArtUrl.get();
    mediaArtUrl.set(initialArtUrl);
};

Variable.derive([bind(activePlayer), bind(forceUpdate)], (player) => {
    updatePosition(player);

    updateLoop(player);
    updateShuffle(player);

    updateCanPlay(player);
    updatePlaybackStatus(player);

    updateCanGoNext(player);
    updateCanGoPrevious(player);

    updateTitle(player);
    updateAlbum(player);
    updateArtist(player);
    updateArtUrl(player);
});
