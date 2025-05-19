import { Astal } from 'astal/gtk3';
import { NotificationAnchor, OSDAnchor, PositionAnchor } from 'src/lib/options/types';

/**
 * Maps a notification or OSD anchor position to an Astal window anchor
 * @param pos - The position anchor to convert
 * @returns The corresponding Astal window anchor
 */
export function getPosition(pos: NotificationAnchor | OSDAnchor): Astal.WindowAnchor {
    const positionMap: PositionAnchor = {
        top: Astal.WindowAnchor.TOP,
        'top right': Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
        'top left': Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        bottom: Astal.WindowAnchor.BOTTOM,
        'bottom right': Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
        'bottom left': Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT,
        right: Astal.WindowAnchor.RIGHT,
        left: Astal.WindowAnchor.LEFT,
    };

    return positionMap[pos] ?? Astal.WindowAnchor.TOP;
}
