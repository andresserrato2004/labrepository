import type { NewReservation, UpdateReservation } from '@database/types';
import type { Session } from '@services/server/types';

/**
 * Arguments required to create a new reservation.
 *
 * @interface CreateReservationArgs
 * @property {NewReservation} request - The new reservation details.
 * @property {Session} session - The session information.
 */
export interface CreateReservationArgs {
	request: NewReservation;
	session: Session;
}

/**
 * Arguments required to update a reservation.
 *
 * @interface UpdateReservationArgs
 * @property {UpdateReservation} request - The updated reservation details.
 * @property {Session} session - The session information.
 */
export interface UpdateReservationArgs {
	request: UpdateReservation;
	session: Session;
}
