import { opt } from 'src/lib/options';

export default {
    ignore: opt<string[]>([]),
    preferredPlayer: opt<string>(''),
    hideAuthor: opt(false),
    hideAlbum: opt(false),
    displayTime: opt(false),
    displayTimeTooltip: opt(false),
    noMediaText: opt('No Media Currently Playing'),
};
