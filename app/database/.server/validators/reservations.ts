import type { z } from 'zod';

import { schema } from '@database';
import { isoDate } from '@database/validators/shared';
import { createInsertSchema } from 'drizzle-zod';
import { zfd } from 'zod-form-data';

const newReservationSchema = createInsertSchema(schema.reservations, {
	endTime: (_schema) => isoDate,
	startTime: (_schema) => isoDate,
	createdAt: (_schema) => isoDate.optional(),
	updatedAt: (_schema) => isoDate.optional(),
});

const newReservationTransformer = (
	data: z.infer<typeof newReservationSchema>,
) => {
	//TODO: Implement data transformation logic here

	return data;
};

export const newReservationValidator = newReservationSchema.transform(
	newReservationTransformer,
);

export const newReservationFormValidator = zfd.formData(newReservationSchema);
