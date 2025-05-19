import { mkOptions } from 'src/lib/options';
import theme from './modules/theme';
import config from './modules/config';

export const options = mkOptions({
    theme: theme,
    ...config,
});
