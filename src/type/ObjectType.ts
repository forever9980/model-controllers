/**
 * Special type that represents class/type of the object.
 */
export type ObjectType<T> = { new (...args: any[]): T }|Function;