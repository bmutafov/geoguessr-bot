export type NullableProperties<T> = { [x in keyof T]: T[x] | null };
