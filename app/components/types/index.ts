/**
 * Defines a type that represents the keys of an object type `T` that have a value of type `U`.
 *
 * @template T - The object type.
 * @template U - The value type.
 * @returns The keys of `T` that have a value of type `U`.
 */
export type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
