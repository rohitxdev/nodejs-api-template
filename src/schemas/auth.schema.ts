import { type JSONSchema } from 'json-schema-typed';

/**
 * @description Password must contain at least one letter, one digit, one special character, and a minimum length of 10 characters
 */
const passwordRegex = '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

export const authValidationSchema = {
	logInBody: {
		type: 'object',
		properties: {
			username: {
				type: 'string',
			},
			password: {
				type: 'string',
			},
		},
		required: ['username', 'password'],
	},
	signUpBody: {
		type: 'object',
		properties: {
			username: {
				type: 'string',
			},
			password: {
				type: 'string',
				minLength: 10,
				pattern: passwordRegex,
			},
		},
		required: ['username', 'password'],
	},
} as const satisfies Record<string, JSONSchema>;
