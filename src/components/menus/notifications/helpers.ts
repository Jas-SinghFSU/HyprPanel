import { bind, Variable } from 'astal';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { notifdService } from 'src/lib/constants/services';
const { displayedTotal } = options.notifications;

/**
 * Handles page boundaries for notifications.
 *
 * This function ensures that the current page is within the valid range of pages based on the total number of notifications.
 * If the current page is empty, it adjusts the current page to the previous page if possible.
 *
 * @param curPage The current page variable.
 */
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
