import { enums, schema } from '@database';
import { isoDate } from '@database/validators/shared';
import { capitalize } from '@services/shared/utility';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const newLoginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

const newLoginTransformer = (data: z.infer<typeof newLoginSchema>) => {
	data.username = data.username.trim().toLowerCase();

	return data;
};

const newUserSchema = createInsertSchema(schema.users, {
	role: (_schema) => zfd.text(z.nativeEnum(enums.UserRole)),
	name: (_schema) => zfd.text(z.string().min(1)),
	username: (_schema) => zfd.text(z.string().min(1)),
	password: (_schema) => zfd.text(z.string().min(1)),
	email: (_schema) => zfd.text(z.string().email()),
	createdAt: (_schema) => zfd.text(isoDate.optional()),
	updatedAt: (_schema) => zfd.text(isoDate.optional()),
});

const newUserTransformer = (data: z.infer<typeof newUserSchema>) => {
	data.name = capitalize(data.name.trim());
	data.username = data.username.trim().toLowerCase();
	data.email = data.email.trim().toLowerCase();

	return data;
};

export const newUserValidator = newUserSchema.transform(newUserTransformer);
export const newUserFormValidator = zfd.formData(newUserSchema);

export const newLoginValidator = newLoginSchema.transform(newLoginTransformer);
export const newLoginFormValidator = zfd.formData(newLoginSchema);
