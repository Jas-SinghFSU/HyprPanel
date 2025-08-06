export type GenericFunction<Value, Parameters extends unknown[]> = (
    ...args: Parameters
) => Promise<Value> | Value;
