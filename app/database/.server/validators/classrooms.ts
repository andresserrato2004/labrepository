import { schema } from '@database';
import { isoDate } from '@database/validators/shared';
import { capitalizeFirstLetter } from '@services/shared/utility';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const newClassroomSchema = createInsertSchema(schema.classrooms, {
	name: (_schema) => zfd.text(z.string().min(1)),

	capacity: (_schema) => zfd.numeric(z.number().int().positive()),

	createdAt: (_schema) => zfd.text(isoDate.optional()),

	updatedAt: (_schema) => zfd.text(isoDate.optional()),
});

const updateClassroomSchema = newClassroomSchema
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		id: zfd.text(z.string()),
	});

const newClassroomTransformer = (data: z.infer<typeof newClassroomSchema>) => {
	data.name = capitalizeFirstLetter(data.name.trim());

	return data;
};

const updateClassroomTransformer = (
	data: z.infer<typeof updateClassroomSchema>,
) => {
	data.name = capitalizeFirstLetter(data.name.trim());

	return data;
};

export const newClassroomValidator = newClassroomSchema.transform(
	newClassroomTransformer,
);
export const newClassroomFormValidator = zfd.formData(newClassroomSchema);

export const updateClassroomValidator = updateClassroomSchema.transform(
	updateClassroomTransformer,
);
export const updateClassroomFormValidator = zfd.formData(updateClassroomSchema);
