import { schema } from '@database';
import { capitalize, isoDate } from '@database/validators/shared';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const newClassroomSchema = createInsertSchema(schema.classrooms, {
	name: (_schema) => zfd.text(z.string().min(1)),

	createdAt: (_schema) => zfd.text(isoDate.optional()),

	updatedAt: (_schema) => zfd.text(isoDate.optional()),
});

const newClassroomTransformer = (data: z.infer<typeof newClassroomSchema>) => {
	data.name = capitalize(data.name.trim());

	return data;
};

export const newClassroomValidator = newClassroomSchema.transform(
	newClassroomTransformer,
);
export const newClassroomFormValidator = zfd.formData(newClassroomSchema);
