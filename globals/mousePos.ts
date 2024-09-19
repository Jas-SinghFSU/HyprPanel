import { Variable as VariableType } from 'types/variable';

const globalMousePosVar: VariableType<number[]> = Variable([0, 0]);

globalThis['globalMousePos'] = globalMousePosVar;
