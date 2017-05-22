/**
 * Used to mark objects as Partial, and all properties and subproperties of these objects as Partial.
 */
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};