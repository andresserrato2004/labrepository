/**
 * Returns the short name from a given full name.
 *
 * @param name - The full name to extract the short name from.
 * @returns The short name extracted from the full name.
 */
export function getShortName(name: string) {
	const names = name.split(' ');

	if (names.length === 1) {
		return names[0];
	}

	if (names.length === 2 || names.length === 3) {
		return `${names[0]} ${names[1]}`;
	}

	if (names.length > 3) {
		return `${names[0]} ${names[2]}`;
	}
}
