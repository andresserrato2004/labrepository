console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ENV:', process.env.ENV);

export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
	},
};
