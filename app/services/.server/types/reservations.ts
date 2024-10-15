import type { NewReservation } from '@database/types';
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
 * Arguments required to create new reservations.
 *
 * @interface CreateReservationsArgs
 * @property {NewReservation[]} requests - An array of new reservation requests.
 * @property {Session} session - The session information for the user making the reservation.
 */
export interface CreateReservationsArgs {
	request: NewReservation[];
	session: Session;
}
