import AstalMpris from 'gi://AstalMpris?version=0.1';
import { bind, Variable } from 'astal';
import { getTimeStamp } from 'src/components/menus/media/components/timebar/helpers';
import { CurrentPlayer, MediaSubscriptionNames, MediaSubscriptions } from './types';
import options from 'src/configuration';

/**
 * MediaManager handles media player state management across the application
 *
 * This class provides a centralized way to track and interact with media players.
 * It handles connection/disconnection events, manages state variables, and keeps
 * media information synchronized across the UI.
 *
 * Since Astal doesn't provide an intuitive way to bind to dynamically changing media
 * players' properties, we have to handle that ourselves. This class will provide a collection
 * of useful bindings to display the media info of the current media player.
 */
export class MediaPlayerService {
    private static _instance: MediaPlayerService;
    public activePlayer: Variable<CurrentPlayer> = Variable(undefined);

    public timeStamp: Variable<string> = Variable('00:00');
    public currentPosition: Variable<number> = Variable(0);

    public loopStatus: Variable<AstalMpris.Loop> = Variable(AstalMpris.Loop.NONE);
    public shuffleStatus: Variable<AstalMpris.Shuffle> = Variable(AstalMpris.Shuffle.OFF);
    public playbackStatus: Variable<AstalMpris.PlaybackStatus> = Variable(AstalMpris.PlaybackStatus.STOPPED);

    public canPlay: Variable<boolean> = Variable(false);
    public canGoNext: Variable<boolean> = Variable(false);
    public canGoPrevious: Variable<boolean> = Variable(false);

    public mediaTitle: Variable<string> = Variable('');
    public mediaAlbum: Variable<string> = Variable('-----');
    public mediaArtist: Variable<string> = Variable('-----');
    public mediaArtUrl: Variable<string> = Variable('');

    private _mprisService: AstalMpris.Mpris;

    private _subscriptions: MediaSubscriptions = {
        position: undefined,
        loop: undefined,
        shuffle: undefined,
        canPlay: undefined,
        playbackStatus: undefined,
        canGoNext: undefined,
        canGoPrevious: undefined,
        title: undefined,
        album: undefined,
        artist: undefined,
        artUrl: undefined,
    };

    private constructor() {
        this._mprisService = AstalMpris.get_default();
        const { noMediaText } = options.menus.media;

        this.mediaTitle.set(noMediaText.get());

        for (const player of this._mprisService.get_players()) {
            this._handlePlayerAdded(player);
        }

        this._mprisService.connect('player-closed', (_, closedPlayer) =>
            this._handlePlayerClosed(closedPlayer),
        );

        this._mprisService.connect('player-added', (_, addedPlayer) => this._handlePlayerAdded(addedPlayer));

        Variable.derive([bind(this.activePlayer)], (player) => {
            this._updateAllMediaProperties(player);
        });
    }

    public static getInstance(): MediaPlayerService {
        if (this._instance === undefined) {
            this._instance = new MediaPlayerService();
        }

        return this._instance;
    }

    /**
     * Handles a new player being added
     *
     * Sets the new player as active if no player is currently active.
     *
     * @param addedPlayer The player that was added
     */
    private _handlePlayerAdded(addedPlayer: AstalMpris.Player): void {
        if (this.activePlayer.get() === undefined) {
            this.activePlayer.set(addedPlayer);
        }
    }

    /**
     * Handles a player being closed
     *
     * Switches to another player if available or clears the active player
     * when the current player is closed.
     *
     * @param closedPlayer The player that was closed
     */
    private _handlePlayerClosed(closedPlayer: AstalMpris.Player): void {
        if (
            this._mprisService.get_players().length === 1 &&
            closedPlayer.busName === this._mprisService.get_players()[0]?.busName
        ) {
            return this.activePlayer.set(undefined);
        }

        if (closedPlayer.busName === this.activePlayer.get()?.busName) {
            const nextPlayer = this._mprisService
                .get_players()
                .find((player) => player.busName !== closedPlayer.busName);
            this.activePlayer.set(nextPlayer);
        }
    }

    /**
     * Updates all media properties based on the current player
     *
     * This synchronizes all state variables with the current media player's state.
     *
     * @param player The current media player
     */
    private _updateAllMediaProperties(player: CurrentPlayer): void {
        this._updatePosition(player);

        this._updateLoop(player);
        this._updateShuffle(player);
        this._updatePlaybackStatus(player);

        this._updateCanPlay(player);
        this._updateCanGoNext(player);
        this._updateCanGoPrevious(player);

        this._updateTitle(player);
        this._updateAlbum(player);
        this._updateArtist(player);
        this._updateArtUrl(player);
    }

    /**
     * Updates the current playback position
     *
     * Tracks both the numeric position and formatted timestamp.
     *
     * @param player The current media player
     */
    private _updatePosition(player: CurrentPlayer): void {
        this._resetSubscription('position');

        if (player === undefined) {
            this.timeStamp.set('00:00');
            this.currentPosition.set(0);
            return;
        }

        const positionBinding = bind(player, 'position');

        this._subscriptions.position = Variable.derive(
            [bind(positionBinding), bind(player, 'playbackStatus')],
            (pos) => {
                if (player?.length > 0) {
                    this.timeStamp.set(getTimeStamp(pos, player.length));
                    this.currentPosition.set(pos);
                } else {
                    this.timeStamp.set('00:00');
                    this.currentPosition.set(0);
                }
            },
        );

        const initialPos = positionBinding.get();
        this.timeStamp.set(getTimeStamp(initialPos, player.length));
        this.currentPosition.set(initialPos);
    }

    /**
     * Updates the loop status for the current player
     *
     * Tracks whether playback loops none, track, or playlist.
     *
     * @param player The current media player
     */
    private _updateLoop(player: CurrentPlayer): void {
        this._resetSubscription('loop');

        if (player === undefined) {
            this.loopStatus.set(AstalMpris.Loop.NONE);
            return;
        }

        const loopBinding = bind(player, 'loopStatus');

        this._subscriptions.loop = Variable.derive(
            [bind(loopBinding), bind(player, 'playbackStatus')],
            (status) => {
                if (player?.length > 0) {
                    this.loopStatus.set(status);
                } else {
                    this.loopStatus.set(AstalMpris.Loop.NONE);
                }
            },
        );

        this.loopStatus.set(loopBinding.get());
    }

    /**
     * Updates the shuffle status for the current player
     *
     * Tracks whether playback order is shuffled.
     *
     * @param player The current media player
     */
    private _updateShuffle(player: CurrentPlayer): void {
        this._resetSubscription('shuffle');

        if (player === undefined) {
            this.shuffleStatus.set(AstalMpris.Shuffle.OFF);
            return;
        }

        const shuffleBinding = bind(player, 'shuffleStatus');

        this._subscriptions.shuffle = Variable.derive(
            [bind(shuffleBinding), bind(player, 'playbackStatus')],
            (status) => {
                this.shuffleStatus.set(status ?? AstalMpris.Shuffle.OFF);
            },
        );

        this.shuffleStatus.set(shuffleBinding.get());
    }

    /**
     * Updates whether playback is possible with current player
     *
     * Used to enable/disable playback controls.
     *
     * @param player The current media player
     */
    private _updateCanPlay(player: CurrentPlayer): void {
        this._resetSubscription('canPlay');

        if (player === undefined) {
            this.canPlay.set(false);
            return;
        }

        const canPlayBinding = bind(player, 'canPlay');

        this._subscriptions.canPlay = Variable.derive(
            [canPlayBinding, bind(player, 'playbackStatus')],
            (playable) => {
                this.canPlay.set(playable ?? false);
            },
        );

        this.canPlay.set(player.canPlay);
    }

    /**
     * Updates the playback status (playing, paused, stopped)
     *
     * Used to show the correct playback status and control state.
     *
     * @param player The current media player
     */
    private _updatePlaybackStatus(player: CurrentPlayer): void {
        this._resetSubscription('playbackStatus');

        if (player === undefined) {
            this.playbackStatus.set(AstalMpris.PlaybackStatus.STOPPED);
            return;
        }

        const playbackStatusBinding = bind(player, 'playbackStatus');

        this._subscriptions.playbackStatus = Variable.derive([playbackStatusBinding], (status) => {
            this.playbackStatus.set(status ?? AstalMpris.PlaybackStatus.STOPPED);
        });

        this.playbackStatus.set(player.playbackStatus);
    }

    /**
     * Updates whether the next track control is enabled
     *
     * Used to enable/disable skip forward controls.
     *
     * @param player The current media player
     */
    private _updateCanGoNext(player: CurrentPlayer): void {
        this._resetSubscription('canGoNext');

        if (player === undefined) {
            this.canGoNext.set(false);
            return;
        }

        const canGoNextBinding = bind(player, 'canGoNext');

        this._subscriptions.canGoNext = Variable.derive(
            [canGoNextBinding, bind(player, 'playbackStatus')],
            (canNext) => {
                this.canGoNext.set(canNext ?? false);
            },
        );

        this.canGoNext.set(player.canGoNext);
    }

    /**
     * Updates whether the previous track control is enabled
     *
     * Used to enable/disable skip backward controls.
     *
     * @param player The current media player
     */
    private _updateCanGoPrevious(player: CurrentPlayer): void {
        this._resetSubscription('canGoPrevious');

        if (player === undefined) {
            this.canGoPrevious.set(false);
            return;
        }

        const canGoPreviousBinding = bind(player, 'canGoPrevious');

        this._subscriptions.canGoPrevious = Variable.derive(
            [canGoPreviousBinding, bind(player, 'playbackStatus')],
            (canPrev) => {
                this.canGoPrevious.set(canPrev ?? false);
            },
        );

        this.canGoPrevious.set(player.canGoPrevious);
    }

    /**
     * Updates the media title display
     *
     * Shows title of current track or a placeholder when nothing is playing.
     *
     * @param player The current media player
     */
    private _updateTitle(player: CurrentPlayer): void {
        this._resetSubscription('title');

        const { noMediaText } = options.menus.media;

        if (player === undefined) {
            this.mediaTitle.set(noMediaText.get());
            return;
        }

        const titleBinding = bind(player, 'title');

        this._subscriptions.title = Variable.derive(
            [titleBinding, bind(player, 'playbackStatus')],
            (newTitle, pbStatus) => {
                if (pbStatus === AstalMpris.PlaybackStatus.STOPPED) {
                    return this.mediaTitle.set(noMediaText.get() ?? '-----');
                }
                this.mediaTitle.set(newTitle.length > 0 ? this._normalizeLabel(newTitle) : '-----');
            },
        );

        const initialTitle = player.title;
        this.mediaTitle.set(initialTitle.length > 0 ? this._normalizeLabel(initialTitle) : '-----');
    }

    /**
     * Updates the album name display
     *
     * Shows album of current track or a placeholder when not available.
     *
     * @param player The current media player
     */
    private _updateAlbum(player: CurrentPlayer): void {
        this._resetSubscription('album');

        if (player === undefined) {
            this.mediaAlbum.set('-----');
            return;
        }

        const albumBinding = bind(player, 'album');

        this._subscriptions.album = Variable.derive(
            [albumBinding, bind(player, 'playbackStatus')],
            (newAlbum) => {
                this.mediaAlbum.set(newAlbum?.length > 0 ? this._normalizeLabel(newAlbum) : '-----');
            },
        );

        const initialAlbum = player.album;
        this.mediaAlbum.set(initialAlbum?.length > 0 ? this._normalizeLabel(initialAlbum) : '-----');
    }

    /**
     * Updates the artist name display
     *
     * Shows artist of current track or a placeholder when not available.
     *
     * @param player The current media player
     */
    private _updateArtist(player: CurrentPlayer): void {
        this._resetSubscription('artist');

        if (player === undefined) {
            this.mediaArtist.set('-----');
            return;
        }

        const artistBinding = bind(player, 'artist');

        this._subscriptions.artist = Variable.derive(
            [artistBinding, bind(player, 'playbackStatus')],
            (newArtist) => {
                this.mediaArtist.set(newArtist?.length > 0 ? this._normalizeLabel(newArtist) : '-----');
            },
        );

        const initialArtist = player.artist;
        this.mediaArtist.set(initialArtist?.length > 0 ? this._normalizeLabel(initialArtist) : '-----');
    }

    /**
     * Updates the album art URL
     *
     * Tracks the URL to the current album artwork if available.
     *
     * @param player The current media player
     */
    private _updateArtUrl(player: CurrentPlayer): void {
        this._resetSubscription('artUrl');

        if (player === undefined) {
            this.mediaArtUrl.set('');
            return;
        }

        const artUrlBinding = bind(player, 'artUrl');

        this._subscriptions.artUrl = Variable.derive(
            [artUrlBinding, bind(player, 'playbackStatus')],
            (newArtUrl) => {
                this.mediaArtUrl.set(newArtUrl ?? '');
            },
        );

        this.mediaArtUrl.set(player.artUrl ?? '');
    }

    /**
     * Normalizes a label by removing newlines
     *
     * Ensures text displays properly in the UI by converting newlines to spaces.
     *
     * @param label The label to normalize
     * @returns Normalized label string
     */
    private _normalizeLabel(label: string): string {
        return label.replace(/\r?\n/g, ' ');
    }

    /**
     * Resets a subscription by dropping it and clearing its reference
     *
     * This helper method safely cleans up a specific subscription to prevent
     * memory leaks and prepare for new subscription assignment. It's used
     * when updating media properties to ensure proper cleanup of previous bindings.
     *
     * @param subscription - The key of the subscription to reset
     */
    private _resetSubscription(subscription: MediaSubscriptionNames): void {
        this._subscriptions[subscription]?.drop();
        this._subscriptions[subscription] = undefined;
    }

    /**
     * Cleans up all subscriptions and bindings
     *
     * Should be called when the media manager is no longer needed
     * to prevent memory leaks.
     */
    public dispose(): void {
        Object.values(this._subscriptions).forEach((sub) => sub?.drop());

        this.activePlayer.drop();

        this.timeStamp.drop();
        this.currentPosition.drop();

        this.loopStatus.drop();
        this.shuffleStatus.drop();
        this.playbackStatus.drop();

        this.canPlay.drop();
        this.canGoNext.drop();
        this.canGoPrevious.drop();

        this.mediaTitle.drop();
        this.mediaAlbum.drop();
        this.mediaArtist.drop();
        this.mediaArtUrl.drop();
    }
}

const mediaPlayerManager = MediaPlayerService.getInstance();

export const {
    activePlayer,
    timeStamp,
    currentPosition,
    loopStatus,
    shuffleStatus,
    canPlay,
    playbackStatus,
    canGoNext,
    canGoPrevious,
    mediaTitle,
    mediaAlbum,
    mediaArtist,
    mediaArtUrl,
} = mediaPlayerManager;
