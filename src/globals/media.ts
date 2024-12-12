import { bind, Variable } from 'astal';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { getTimeStamp } from 'src/components/menus/media/components/timebar/helpers';
import { mprisService } from 'src/lib/constants/services';
import options from 'src/options';

const { noMediaText } = options.menus.media;

export const activePlayer = Variable<AstalMpris.Player | undefined>(mprisService.players[0]);

mprisService.connect('player-closed', (_, closedPlayer) => {
    if (closedPlayer.busName === activePlayer.get()?.busName) {
        activePlayer.set(mprisService.players[0]);
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

const updatePosition = (player: AstalMpris.Player): void => {
    if (positionUnsub) {
        positionUnsub();
        positionUnsub.drop();
    }

    const loopBinding = bind(player, 'position');

    if (!player) {
        timeStamp.set('00:00');
        currentPosition.set(0);
        return;
    }

    positionUnsub = Variable.derive([bind(loopBinding), bind(player, 'playbackStatus')], (pos) => {
        if (player.length > 0) {
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

const updateLoop = (player: AstalMpris.Player): void => {
    if (loopUnsub) {
        loopUnsub();
        loopUnsub.drop();
    }

    const loopBinding = bind(player, 'loopStatus');

    if (!player) {
        loopStatus.set(AstalMpris.Loop.NONE);
        return;
    }

    loopUnsub = Variable.derive([bind(loopBinding), bind(player, 'playbackStatus')], (status) => {
        if (player.length > 0) {
            loopStatus.set(status);
        } else {
            currentPosition.set(AstalMpris.Loop.NONE);
        }
    });

    const initialStatus = loopBinding.get();

    loopStatus.set(initialStatus);
};

const updateShuffle = (player: AstalMpris.Player): void => {
    if (shuffleUnsub) {
        shuffleUnsub();
        shuffleUnsub.drop();
    }

    const shuffleBinding = bind(player, 'shuffleStatus');

    if (!player) {
        shuffleStatus.set(AstalMpris.Shuffle.OFF);
        return;
    }

    shuffleUnsub = Variable.derive([bind(shuffleBinding), bind(player, 'playbackStatus')], (status) => {
        shuffleStatus.set(status);
    });

    const initialStatus = shuffleBinding.get();
    shuffleStatus.set(initialStatus);
};

const updateCanPlay = (player: AstalMpris.Player): void => {
    if (canPlayUnsub) {
        canPlayUnsub();
        canPlayUnsub.drop();
    }

    if (!player) {
        canPlay.set(false);
        return;
    }

    const canPlayBinding = bind(player, 'canPlay');

    canPlayUnsub = Variable.derive([canPlayBinding, bind(player, 'playbackStatus')], (playable) => {
        canPlay.set(playable);
    });

    const initialCanPlay = canPlay.get();
    canPlay.set(initialCanPlay);
};

const updatePlaybackStatus = (player: AstalMpris.Player): void => {
    if (playbackStatusUnsub) {
        playbackStatusUnsub();
        playbackStatusUnsub.drop();
    }

    if (!player) {
        playbackStatus.set(AstalMpris.PlaybackStatus.STOPPED);
        return;
    }

    const playbackStatusBinding = bind(player, 'playbackStatus');

    playbackStatusUnsub = Variable.derive([playbackStatusBinding], (status) => {
        playbackStatus.set(status);
    });

    const initialStatus = playbackStatus.get();

    playbackStatus.set(initialStatus);
};

const updateCanGoNext = (player: AstalMpris.Player): void => {
    if (canGoNextUnsub) {
        canGoNextUnsub();
        canGoNextUnsub.drop();
    }

    if (!player) {
        canGoNext.set(false);
        return;
    }

    const canGoNextBinding = bind(player, 'canGoNext');

    canGoNextUnsub = Variable.derive([canGoNextBinding, bind(player, 'playbackStatus')], (canNext) => {
        canGoNext.set(canNext);
    });

    const initialCanNext = canGoNext.get();
    canGoNext.set(initialCanNext);
};

const updateCanGoPrevious = (player: AstalMpris.Player): void => {
    if (canGoPreviousUnsub) {
        canGoPreviousUnsub();
        canGoPreviousUnsub.drop();
    }

    if (!player) {
        canGoPrevious.set(false);
        return;
    }

    const canGoPreviousBinding = bind(player, 'canGoPrevious');

    canGoPreviousUnsub = Variable.derive([canGoPreviousBinding, bind(player, 'playbackStatus')], (canPrev) => {
        canGoPrevious.set(canPrev);
    });

    const initialCanPrev = canGoPrevious.get();
    canGoPrevious.set(initialCanPrev);
};

const updateTitle = (player: AstalMpris.Player): void => {
    if (titleUnsub) {
        titleUnsub();
        titleUnsub.drop();
    }

    if (!player) {
        mediaTitle.set(noMediaText.get());
        return;
    }

    const titleBinding = bind(player, 'title');

    titleUnsub = Variable.derive([titleBinding, bind(player, 'playbackStatus')], (newTitle, pbStatus) => {
        if (pbStatus === AstalMpris.PlaybackStatus.STOPPED) {
            return mediaTitle.set(noMediaText.get());
        }

        mediaTitle.set(newTitle.length > 0 ? newTitle : '-----');
    });

    const initialTitle = mediaTitle.get();
    mediaTitle.set(initialTitle.length > 0 ? initialTitle : '-----');
};

const updateAlbum = (player: AstalMpris.Player): void => {
    if (albumUnsub) {
        albumUnsub();
        albumUnsub.drop();
    }

    if (!player) {
        mediaAlbum.set('-----');
        return;
    }

    albumUnsub = Variable.derive([bind(player, 'album'), bind(player, 'playbackStatus')], (newAlbum) => {
        mediaAlbum.set(newAlbum.length > 0 ? newAlbum : '-----');
    });

    const initialAlbum = mediaAlbum.get();
    mediaAlbum.set(initialAlbum.length > 0 ? initialAlbum : '-----');
};

const updateArtist = (player: AstalMpris.Player): void => {
    if (artistUnsub) {
        artistUnsub();
        artistUnsub.drop();
    }

    if (!player) {
        mediaArtist.set('-----');
        return;
    }

    const artistBinding = bind(player, 'artist');

    artistUnsub = Variable.derive([artistBinding, bind(player, 'playbackStatus')], (newArtist) => {
        mediaArtist.set(newArtist.length > 0 ? newArtist : '-----');
    });

    const initialArtist = mediaArtist.get();
    mediaArtist.set(initialArtist.length > 0 ? initialArtist : '-----');
};

const updateArtUrl = (player: AstalMpris.Player): void => {
    if (artUrlUnsub) {
        artUrlUnsub();
        artUrlUnsub.drop();
    }
    if (!player) {
        mediaArtUrl.set('');
        return;
    }

    const artUrlBinding = bind(player, 'artUrl');

    artUrlUnsub = Variable.derive([artUrlBinding, bind(player, 'playbackStatus')], (newArtUrl) => {
        mediaArtUrl.set(newArtUrl);
    });

    const initialArtUrl = mediaArtUrl.get();
    mediaArtUrl.set(initialArtUrl);
};

Variable.derive([bind(activePlayer)], (player) => {
    if (player === undefined) {
        return;
    }

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
