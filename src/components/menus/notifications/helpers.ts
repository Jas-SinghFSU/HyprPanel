import { bind, Variable } from 'astal';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { notifdService } from 'src/lib/constants/services';
const { displayedTotal } = options.notifications;

export const handlePageBoundaries = (curPage: Variable<number>): void => {
    Variable.derive(
        [bind(curPage), bind(displayedTotal), bind(notifdService, 'notifications')],
        (currentPage: number, dispTotal: number, notifications: AstalNotifd.Notification[]) => {
            const isPageEmpty = notifications.length <= (currentPage - 1) * dispTotal;

            if (isPageEmpty) {
                const previousPage = currentPage <= 1 ? 1 : currentPage - 1;

                curPage.set(previousPage);
            }
        },
    );
};
