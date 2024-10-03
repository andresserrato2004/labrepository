import type { PeriodName } from '@database/types';

import { schema } from '@database';
import { isoDate } from '@database/validators/shared';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

/**
 * Regular expression pattern for validating semester format.
 *
 * The semester format should follow the pattern: YYYY-(1|I|2)
 *
 * - YYYY: Four-digit year
 * - (1|I|2): Semester identifier, can be either 1, I, or 2
 */
const semesterRegex = /^\d{4}-(1|I|2)$/;

const semesterValidator = zfd
	.text(z.string().regex(semesterRegex))
	.refine((val): val is PeriodName => true);

const newAcademicPeriodSchema = createInsertSchema(schema.academicPeriods, {
	name: (_schema) => semesterValidator,
	startDate: (_schema) => isoDate,
	endDate: (_schema) => isoDate,
	createdAt: (_schema) => isoDate.optional(),
	updatedAt: (_schema) => isoDate.optional(),
});

const newAcademicPeriodTransformer = (
	data: z.infer<typeof newAcademicPeriodSchema>,
) => {
	//TODO: Implement data transformation logic here

	return data;
};

export const newAcademicPeriodValidator = newAcademicPeriodSchema.transform(
	newAcademicPeriodTransformer,
);

export const newAcademicPeriodFormValidator = zfd.formData(
	newAcademicPeriodValidator,
);
