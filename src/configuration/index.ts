import { mkOptions } from 'src/lib/options';
import theme from './modules/theme';
import config from './modules/config';

const options = mkOptions({
    theme: theme,
    ...config,
});

export default options;
