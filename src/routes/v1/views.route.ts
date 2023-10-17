import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type FastifyPluginAsync } from 'fastify';

import { viewsValidationSchema } from '../../schemas/views.schema.js';

export const viewRouterPlugin: FastifyPluginAsync = async (fastify) => {
	const app = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	app.route({
		method: 'GET',
		url: '/',
		prefixTrailingSlash: 'no-slash',
		schema: {
			querystring: viewsValidationSchema.rootQueryString,
		},
		handler: (request, reply) =>
			reply.view('hello', {
				name: request.query.name,
			}),
	});
};
