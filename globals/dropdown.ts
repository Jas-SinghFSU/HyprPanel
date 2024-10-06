import { Variable as VariableType } from 'types/variable';

type GlobalEventBoxes = {
    [key: string]: unknown;
};
export const globalEventBoxes: VariableType<GlobalEventBoxes> = Variable({});
