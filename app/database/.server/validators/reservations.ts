import type { NewReservation } from '@database/types';

import { schema } from '@database';
import { isoDate } from '@database/validators/shared';
import { parseTime, parseZonedDateTime } from '@internationalized/date';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const newFormReservationSchema = z.object({
	date: isoDate,
	course: zfd.text(),
	userId: zfd.text(),
	classroomId: zfd.text(),
	startHour: zfd.text(),
	endHour: zfd.text(),
	description: zfd.text().optional(),
});

const newReservationSchema = createInsertSchema(schema.reservations, {
	endTime: (_schema) => isoDate,
	startTime: (_schema) => isoDate,
	createdAt: (_schema) => isoDate.optional(),
	updatedAt: (_schema) => isoDate.optional(),
});

const newReservationFormTransformer = (
	data: z.infer<typeof newFormReservationSchema>,
) => {
	const reservationDate = parseZonedDateTime(data.date);
	const reservationStartHour = parseTime(data.startHour);
	const reservationEndHour = parseTime(data.endHour);

	const startTime = reservationDate
		.set({
			hour: reservationStartHour.hour,
			minute: reservationStartHour.minute,
			second: 0,
		})
		.toAbsoluteString();

	const endTime = reservationDate
		.set({
			hour: reservationEndHour.hour,
			minute: reservationEndHour.minute,
			second: 0,
		})
		.toAbsoluteString();

	const { date, startHour, endHour, ...rest } = data;

	const result: NewReservation = {
		...rest,
		startTime,
		endTime,
	};

	return result;
};

const newReservationTransformer = (
	data: z.infer<typeof newReservationSchema>,
) => {
	return data;
};

export const newReservationValidator = newReservationSchema.transform(
	newReservationTransformer,
);

export const newReservationFormValidator = zfd.formData(
	newFormReservationSchema.transform(newReservationFormTransformer),
);
