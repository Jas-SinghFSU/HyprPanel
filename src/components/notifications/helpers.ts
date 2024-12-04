import { bind, Variable } from 'astal';
import { hyprlandService } from 'src/lib/constants/services';

export const trackActiveMonitor = (curMonitor: Variable<number>): void => {
    Variable.derive([bind(hyprlandService, 'focusedMonitor')], (monitor) => {
        curMonitor.set(monitor.id);
    });
};
