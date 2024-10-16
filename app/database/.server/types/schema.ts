import type * as schema from '@database/schema/tables';
import type { zfd } from 'zod-form-data';

/**
 * Represents the configuration for an IsoTimeStamp custom type on postgres.
 */
export type IsoTimeStampConfig = {
	data: string;
	driverData: string;
	config: undefined;
};

/**
 * Represents a semester in the format of `${year}-${term}`.
 * - `year` is a number representing the year of the semester.
 * - `term` is either `'1'`, `'I'`, or `'2'`, representing the first semester, the interim semester, or the second semester respectively.
 */
export type PeriodName = `${number}-${'1' | 'I' | '2'}`;

/**
 * Represents the structure of a new login.
 */
export type NewLogin = {
	username: string;
	password: string;
};

/**
 * Represents the definition of a User object in the schema.
 */
export type User = typeof schema.users.$inferSelect;

/**
 * Represents the definition of a User object in the schema excluding the password.
 */
export type InfoUser = Omit<User, 'password'>;

/**
 * Represents the type definition for creating a new user.
 */
export type NewUser = typeof schema.users.$inferInsert;

/**
 * Represents the type definition for the Classroom object in the schema.
 */
export type Classroom = typeof schema.classrooms.$inferSelect;

/**
 * Represents the type definition for creating a new classroom.
 */
export type NewClassroom = typeof schema.classrooms.$inferInsert;

/**
 * Represents the type definition for the AcademicPeriod entity in the schema.
 */
export type AcademicPeriod = typeof schema.academicPeriods.$inferSelect;

/**
 * Represents the type definition for creating a new academic period.
 */
export type NewAcademicPeriod = typeof schema.academicPeriods.$inferInsert;

/**
 * Represents the type definition for the AuditLog entity in the schema.
 */
export type AuditLog = typeof schema.auditLogs.$inferSelect;

/**
 * Represents the type definition for a new audit log.
 */
export type NewAuditLog = typeof schema.auditLogs.$inferInsert;

/**
 * Represents the type definition for the ErrorLog entity in the schema.
 */
export type ErrorLog = typeof schema.errorLogs.$inferSelect;

/**
 * Represents the type definition for a new error log.
 */
export type NewErrorLog = typeof schema.errorLogs.$inferInsert;

/**
 * Represents the type definition for the Reservation entity in the schema.
 */
export type Reservation = typeof schema.reservations.$inferSelect;

/**
 * Represents the type definition for creating a new reservation.
 */
export type NewReservation = typeof schema.reservations.$inferInsert & {
	repeatOnWeeks?: number[];
};

/**
 * Represents a reservation with a classroom.
 */
export interface ExtendedReservation extends Reservation {
	classroom: Pick<Classroom, 'id' | 'name'>;
	user: Pick<User, 'id' | 'name'>;
}

/**
 * Interface representing the form data for creating a new reservation.
 *
 * This interface extends the `NewReservation` type, omitting the `startTime`
 * and `endTime` properties, and instead includes `date`, `startHour`, and `endHour`
 * as strings.
 *
 * @interface FormNewReservation
 * @extends {Omit<NewReservation, 'startTime' | 'endTime'>}
 *
 * @property {string} date - The date of the reservation in YYYY-MM-DD format.
 * @property {string} startHour - The start hour of the reservation in HH:mm format.
 * @property {string} endHour - The end hour of the reservation in HH:mm format.
 */
export interface FormNewReservation
	extends Omit<NewReservation, 'startTime' | 'endTime'> {
	date: string;
	startHour: string;
	endHour: string;
}

/**
 * Represents the type of a form data validator.
 */
export type FormDataValidator = ReturnType<typeof zfd.formData>;

/**
 * Represents an audit action.
 * It can be either an instance of `schema.AuditAction` or a string that matches the format `${schema.AuditAction}`.
 */
export type AuditAction = schema.AuditAction | `${schema.AuditAction}`;

/**
 * Represents an application resource.
 * It can be either an instance of `schema.AppResource` or a string that matches the format `${schema.AppResource}`.
 */
export type AppResource = schema.AppResource | `${schema.AppResource}`;

/**
 * Represents a user role.
 * It can be either an instance of `schema.UserRole` or a string that matches the format `${schema.UserRole}`.
 */
export type UserRole = schema.UserRole | `${schema.UserRole}`;
