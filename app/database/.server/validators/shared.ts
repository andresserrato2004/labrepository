import { z } from 'zod';

//ISO 8601 dateTime: 2024-07-22T05:00:00.000Z or 2024-07-23T00:00:00-05:00[America/Bogota]
export const isoDate = z
	.string()
	.regex(
		/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}\[.*\])$/,
	);
