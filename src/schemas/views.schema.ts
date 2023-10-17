import { type JSONSchema } from 'json-schema-typed';
export const viewsValidationSchema = {
	rootQueryString: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
			},
		},
		required: ['name'],
	},
} as const satisfies Record<string, JSONSchema>;
