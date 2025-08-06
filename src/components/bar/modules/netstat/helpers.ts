import NetworkUsageService from 'src/services/system/networkUsage';
import { bind, Variable } from 'astal';
import options from 'src/configuration';

const { networkInterface, rateUnit, round, pollingInterval } = options.bar.customModules.netstat;

export const setupNetworkServiceBindings = (networkService: NetworkUsageService): void => {
    Variable.derive([bind(pollingInterval)], (interval) => {
        networkService.updateTimer(interval);
    })();

    Variable.derive([bind(networkInterface)], (interfaceName) => {
        networkService.setInterface(interfaceName);
    })();

    Variable.derive([bind(rateUnit)], (unit) => {
        networkService.setRateUnit(unit);
    })();

    Variable.derive([bind(round)], (shouldRound) => {
        networkService.setShouldRound(shouldRound);
    })();
};

export const cycleArray = <T>(array: T[], current: T, direction: 'next' | 'prev'): T => {
    const currentIndex = array.indexOf(current);
    const nextIndex =
        direction === 'next'
            ? (currentIndex + 1) % array.length
            : (currentIndex - 1 + array.length) % array.length;
    return array[nextIndex];
};
