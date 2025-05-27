import { opt } from 'src/lib/options';
import { NotificationAnchor } from 'src/lib/options/types';

export default {
    position: opt<NotificationAnchor>('top right'),
    ignore: opt<string[]>([]),
    displayedTotal: opt(10),
    monitor: opt(0),
    active_monitor: opt(true),
    showActionsOnHover: opt(false),
    timeout: opt(7000),
    autoDismiss: opt(false),
    cache_actions: opt(true),
    clearDelay: opt(100),
};
