import { schema } from '@database';
import { courseMnemonic, isoDate } from '@database/validators/shared';
import { parseTime, parseZonedDateTime } from '@internationalized/date';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const baseReservationSchema = createInsertSchema(schema.reservations, {
	endTime: (_schema) => isoDate,
	startTime: (_schema) => isoDate,
	createdAt: (_schema) => isoDate.optional(),
	updatedAt: (_schema) => isoDate.optional(),
});

const newFormReservationSchema = z.object({
	date: isoDate,
	course: courseMnemonic,
	userId: zfd.text(),
	classroomId: zfd.text(),
	startHour: zfd.text(),
	endHour: zfd.text(),
	description: zfd.text(z.string().optional()),
	repeatOnWeeks: zfd.text(z.string().optional()),
});

const newReservationSchema = baseReservationSchema.extend({
	repeatOnWeeks: z.array(z.number()).optional(),
});

const newReservationFormTransformer = (
	data: z.infer<typeof newFormReservationSchema>,
) => {
	const repeatOnWeeks = data.repeatOnWeeks
		? data.repeatOnWeeks.split(',').map((value) => Number.parseInt(value))
		: [];
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

	const result = {
		...rest,
		startTime,
		endTime,
		repeatOnWeeks,
	};

	return result;
};

const newReservationTransformer = (
	data: z.infer<typeof newReservationSchema>,
) => {
	data.course = data.course.trim().toUpperCase();

	return data;
};

export const newReservationValidator = newReservationSchema.transform(
	newReservationTransformer,
);

export const newReservationFormValidator = zfd.formData(
	newFormReservationSchema.transform(newReservationFormTransformer),
);
