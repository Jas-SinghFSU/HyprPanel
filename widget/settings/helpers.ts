export const pageList = <T extends object>(obj: T): Array<keyof T> => {
    return Object.keys(obj) as Array<keyof T>;
};
