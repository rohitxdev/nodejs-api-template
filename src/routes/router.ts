import { FastifyPluginAsync } from 'fastify';
import httpStatus from 'http-status';

import { env } from '../constants/env.js';
import { authRouterPlugin } from './v1/auth.route.js';
import { viewRouterPlugin } from './v1/views.route.js';

const v1Plugin: FastifyPluginAsync = async (app) => {
	await app.register(authRouterPlugin, {
		prefix: '/auth',
	});
	await app.register(viewRouterPlugin, {
		prefix: '/views',
	});

	app.route({
		method: 'GET',
		url: '/',
		schema: { description: 'Home page' },
		handler: (_, reply) =>
			reply.view('home', {
				nodeEnv: env.NODE_ENV,
				time: new Date().toUTCString(),
			}),
	});
};

export const routerPlugin: FastifyPluginAsync = async (app) => {
	await app.register(v1Plugin, { prefix: '/v1' });

	app.route({
		method: 'GET',
		url: '/',
		schema: {
			description: 'Redirects to /v1',
			response: {
				[httpStatus.TEMPORARY_REDIRECT]: {
					type: 'null',
					description: 'Temporary Redirect',
				},
			},
		},
		handler: (_, reply) => reply.redirect(httpStatus.TEMPORARY_REDIRECT, '/v1'),
	});
};
