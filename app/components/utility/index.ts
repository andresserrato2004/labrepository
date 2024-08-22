/**
 * Sets the value of a data attribute based on a condition.
 *
 * @param condition - The condition to evaluate.
 * @returns The value of the data attribute if the condition is true, otherwise undefined.
 */
export function dataAttr(condition: unknown | undefined) {
	return condition ? 'true' : undefined;
}
