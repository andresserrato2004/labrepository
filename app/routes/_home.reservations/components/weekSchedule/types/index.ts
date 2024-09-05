import type { ExtendedReservation } from '@database/types';
import type { ComponentProps, RefObject } from 'react';

export interface ReservationCellProps extends ComponentProps<'div'> {
	reservation: ExtendedReservation;
	wrapperRef: RefObject<HTMLDivElement>;
}
