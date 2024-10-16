import type { AcademicPeriod } from '@database/types';
import type { DateValue } from '@internationalized/date';

/**
 * Represents an existing current period within an academic context.
 *
 * @interface ExistingCurrentPeriod
 *
 * @property {AcademicPeriod} period - The academic period associated with this current period.
 * @property {number} selectedWeek - The currently selected week within the academic period.
 * @property {DateValue} startDate - The start date of the current period.
 * @property {DateValue} endDate - The end date of the current period.
 */
export interface ExistingCurrentPeriod {
	period: AcademicPeriod;
	selectedWeek: number;
	startDate: DateValue;
	endDate: DateValue;
}

/**
 * Interface representing a missing current period.
 *
 * @interface MissingCurrentPeriod
 *
 * @property {undefined} period - The period which is currently missing.
 * @property {number} selectedWeek - The selected week number.
 * @property {undefined} startDate - The start date of the period, which is currently missing.
 * @property {undefined} endDate - The end date of the period, which is currently missing.
 */
export interface MissingCurrentPeriod {
	period: undefined;
	selectedWeek: number;
	startDate: undefined;
	endDate: undefined;
}
