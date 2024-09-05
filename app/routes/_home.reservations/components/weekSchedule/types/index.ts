import type { ExtendedReservation } from '@database/types';
import type { ComponentProps, RefObject } from 'react';

/**
 * Represents the props for a reservation cell component.
 */
export interface ReservationCellProps extends ComponentProps<'div'> {
	reservation: ExtendedReservation;
	wrapperRef: RefObject<HTMLDivElement>;
}
