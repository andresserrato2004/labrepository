import { z } from 'zod';

//ISO 8601 dateTime: 2024-07-22T05:00:00.000Z or 2024-07-23T00:00:00-05:00[America/Bogota] or 2024-07-23
export const isoDate = z
	.string()
	.regex(
		/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}\[.*\])|(\d{4}-\d{2}-\d{2})$/,
	);

//Course regex: ABC1 or ABCD
export const courseMnemonic = z
	.string()
	.regex(/^[a-zA-Z]{4}|[a-zA-Z]{3}\d{1}$/);
