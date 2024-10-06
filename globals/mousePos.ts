import { MousePos } from 'lib/types/globals';
import { Variable as VariableType } from 'types/variable';

const globalMousePosVar: VariableType<MousePos> = Variable({
    source: '',
    pos: [0, 0],
});

type GlobalEventBoxes = {
    [key: string]: unknown;
};
export const globalEventBoxes: VariableType<GlobalEventBoxes> = Variable({});

globalThis['globalMousePos'] = globalMousePosVar;
