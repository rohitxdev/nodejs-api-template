import { z } from 'zod';

const envSchema = z
	.object({
		NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
		LOGS_ENABLED: z.union([z.literal('true'), z.literal('false')]),
		MAX_INSTANCES: z.string().nonempty(),
		MAX_REQUESTS_PER_MINUTE: z.string().nonempty(),
		HOST: z.string().nonempty().ip(),
		PORT: z.string().nonempty(),
		TLS_CERT_PATH: z.string().nonempty(),
		TLS_KEY_PATH: z.string().nonempty(),
		JWT_SECRET: z.string().min(32),
	})
	.transform((val) => ({
		...val,
		IS_DEV: val.NODE_ENV !== 'production',
		LOGS_ENABLED: val.LOGS_ENABLED === 'true',
		MAX_INSTANCES: Number(val.MAX_INSTANCES),
		MAX_REQUESTS_PER_MINUTE: Number(val.MAX_REQUESTS_PER_MINUTE),
		PORT: Number(val.PORT),
	}));

const envVariables: Partial<Record<keyof z.infer<typeof envSchema>, unknown>> = {
	HOST: process.env.HOST,
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	LOGS_ENABLED: process.env.LOGS_ENABLED,
	MAX_INSTANCES: process.env.MAX_INSTANCES,
	MAX_REQUESTS_PER_MINUTE: process.env.MAX_REQUESTS_PER_MINUTE,
	TLS_CERT_PATH: process.env.TLS_CERT_PATH,
	TLS_KEY_PATH: process.env.TLS_KEY_PATH,
	JWT_SECRET: process.env.JWT_SECRET,
};

const undefinedList: string[] = [];

Object.entries(envVariables).forEach(([key, val]) => {
	if (val === undefined) {
		undefinedList.push(key);
	}
});

if (undefinedList.length > 0) {
	throw new Error(
		`${undefinedList.join(', ')} ${undefinedList.length > 1 ? 'are' : 'is'} undefined`,
	);
}

export const env = Object.freeze(envSchema.parse(envVariables));
