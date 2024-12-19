import Variable from 'astal/variable';

type GlobalEventBoxes = {
    [key: string]: unknown;
};
export const globalEventBoxes: Variable<GlobalEventBoxes> = Variable({});
