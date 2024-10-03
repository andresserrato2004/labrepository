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

/**
 * Generates a seeded random number based on the given string and limit.
 *
 * @param str - The string used to seed the random number generator.
 * @param limit - The upper limit of the generated random number.
 * @returns A seeded random number between 0 and the specified limit.
 */
export function getSeededRandom(str: string, limit: number) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash) % (limit + 1);
}

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(str: string) {
	return str
		.split(' ')
		.map(
			(word) =>
				word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join(' ');
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
