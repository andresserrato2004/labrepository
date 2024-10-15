import type { DateValue } from '@internationalized/date';

import { fromDate, getLocalTimeZone } from '@internationalized/date';

/**
 * Returns the Monday of the week for the given date.
 *
 * @param date - The date for which to find the Monday.
 * @returns The date value representing the Monday of the week.
 */
export function getMonday(date: DateValue): DateValue;
export function getMonday(date: Date): DateValue;
export function getMonday(date: string): DateValue;

export function getMonday(date: DateValue | Date | string): DateValue {
	let parsedDate: Date;

	if (typeof date === 'string') {
		parsedDate = new Date(date);
	} else if (date instanceof Date) {
		parsedDate = date;
	} else {
		parsedDate = date.toDate(getLocalTimeZone());
	}

	const day = parsedDate.getDay();
	const diff = parsedDate.getDate() - day + (day === 0 ? -6 : 1);
	const monday = new Date(parsedDate.setDate(diff));

	return fromDate(monday, getLocalTimeZone());
}

/**
 * Returns the Sunday of the week for the given date.
 *
 * @param date - The date for which to find the Sunday.
 * @returns The date representing the Sunday of the week.
 */
export function getSunday(date: DateValue): DateValue;
export function getSunday(date: Date): DateValue;
export function getSunday(date: string): DateValue;

export function getSunday(date: DateValue | Date | string): DateValue {
	let parsedDate: Date;

	if (typeof date === 'string') {
		parsedDate = new Date(date);
	} else if (date instanceof Date) {
		parsedDate = date;
	} else {
		parsedDate = date.toDate(getLocalTimeZone());
	}

	const day = parsedDate.getDay();
	const diff = parsedDate.getDate() + (7 - day);
	const sunday = new Date(parsedDate.setDate(diff));

	return fromDate(sunday, getLocalTimeZone());
}
