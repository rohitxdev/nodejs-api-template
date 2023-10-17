import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyPluginAsync } from 'fastify';

import { roles } from '../../constants/roles.js';
import { auth } from '../../middleware/auth.js';
import { authValidationSchema } from '../../schemas/auth.schema.js';

export const authRouterPlugin: FastifyPluginAsync = async (fastify) => {
	const app = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	app.route({
		method: 'POST',
		url: '/log-in',
		schema: {
			description: 'Log in to the application',
			tags: ['auth'],
			body: authValidationSchema.logInBody,
		},
		handler: (request, reply) => reply.send('Logged in!'),
	});

	app.route({
		method: 'POST',
		url: '/log-out',
		schema: {
			description: 'Log out of the application',
			tags: ['auth'],
		},
		preHandler: auth(roles.USER),
		handler: (request, reply) => reply.send('Logged out!'),
	});

	app.route({
		method: 'POST',
		url: '/sign-up',

		schema: {
			description: 'Create an account',
			tags: ['auth'],
			body: authValidationSchema.signUpBody,
		},
		handler: (request, reply) => reply.send('Signed Up!'),
	});

	app.route({
		method: 'POST',
		url: '/refresh-token',
		schema: {
			description: 'Refresh access token',
			tags: ['auth'],
		},
		handler: (request, reply) => reply.send('Refreshed tokens!'),
	});
};
