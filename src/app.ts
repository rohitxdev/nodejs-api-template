import fs from 'node:fs/promises';
import path from 'node:path';

import acceptsPlugin from '@fastify/accepts';
import cookiePlugin from '@fastify/cookie';
import corsPlugin from '@fastify/cors';
import eTagPlugin from '@fastify/etag';
import formBodyPlugin from '@fastify/formbody';
import helmetPlugin from '@fastify/helmet';
import multipartPlugin from '@fastify/multipart';
import rateLimitPlugin from '@fastify/rate-limit';
import staticPlugin from '@fastify/static';
import swaggerPlugin from '@fastify/swagger';
import swaggerUIPlugin from '@fastify/swagger-ui';
import underPressurePlugin from '@fastify/under-pressure';
import viewPlugin from '@fastify/view';
import webSocketsPlugin from '@fastify/websocket';
import chalk from 'chalk';
import { fastify } from 'fastify';
import type { PinoLoggerOptions } from 'fastify/types/logger.js';
import bcryptPlugin from 'fastify-bcrypt';
import handlebars from 'handlebars';

import { env } from './constants/env.js';
import { routerPlugin } from './routes/router.js';
import { connectDB } from './utils/connect-db.js';

export const app = fastify({
	http2: true,
	https: {
		allowHTTP1: true,
		cert: env.TLS_CERT_PATH && (await fs.readFile(env.TLS_CERT_PATH)),
		key: env.TLS_KEY_PATH && (await fs.readFile(env.TLS_KEY_PATH)),
	},
	keepAliveTimeout: 5 * 1000,
	logger: {
		enabled: env.LOGS_ENABLED,
		transport: {
			target: 'pino-pretty',
			options: {
				singleLine: true,
				destination: env.IS_DEV ? 1 : './logs.txt',
				translateTime: `UTC:yyyy-mm-dd'T'HH:MM:ss'Z'`,
				ignore: 'hostname,req.hostname,req.remotePort,err',
			} as PinoLoggerOptions,
		},
	},
});

await app
	.register(acceptsPlugin)
	.register(bcryptPlugin, { saltWorkFactor: 11 })
	.register(corsPlugin, {
		origin: env.IS_DEV ? ['https://127.0.0.1'] : ['*'],
		credentials: true,
	})
	.register(cookiePlugin)
	.register(eTagPlugin)
	.register(formBodyPlugin)
	.register(multipartPlugin)
	.register(helmetPlugin)
	.register(rateLimitPlugin, {
		max: env.MAX_REQUESTS_PER_MINUTE,
		ban: 5,
	})
	.register(staticPlugin, {
		root: path.resolve('./public'),
		prefix: '/',
	})
	.register(swaggerPlugin, {
		swagger: {
			info: { title: 'Node.js App', version: '1.0.0', description: 'Node.js template' },
			schemes: ['https'],
			consumes: ['application/json'],
			produces: ['application/json'],
		},
	})
	.register(swaggerUIPlugin, {
		prefix: '/docs',
		staticCSP: true,
		uiConfig: {
			docExpansion: 'list',
			deepLinking: false,
		},
		transformSpecification: (swaggerObject, req) => {
			return { ...swaggerObject, host: req.hostname };
		},
	})
	.register(viewPlugin, {
		engine: { handlebars },
		root: path.resolve('./views'),
		viewExt: 'hbs',
		defaultContext: {
			dev: env.IS_DEV,
		},
	})
	.register(webSocketsPlugin, {
		connectionOptions: { encoding: 'utf-8' },
	})
	.register(underPressurePlugin, {
		maxEventLoopDelay: 1000,
		maxHeapUsedBytes: 100000000,
		maxRssBytes: 100000000,
		maxEventLoopUtilization: 0.98,
		retryAfter: 1000,
	})
	.register(routerPlugin);

app.addHook('onRequestAbort', (r) => {
	app.log.info('Request aborted', r.id);
});

app.decorateRequest('user', null);

const generateDocs = async () => {
	try {
		const filePath = './docs/swagger.yaml';
		console.log(chalk.bold.white('>> Generating docs...'));
		await fs.writeFile(filePath, app.swagger({ yaml: true }));
		console.log(chalk.bold.green(`>> Generated docs successfully @ ${filePath}`));
	} catch (err) {
		console.log(chalk.bold.red('>> Could not generate docs'));
		console.error(err);
	}
};

export const run = async () => {
	try {
		await connectDB();
		await app.ready();
		generateDocs();
		const address = await app.listen({
			host: env.HOST,
			port: env.PORT,
		});
		if (process?.send) {
			process?.send({ address });
		}
	} catch (err) {
		if (err instanceof Error && err.message.includes('EADDRINUSE')) {
			return console.log(chalk.bold.red(`Error: Port ${env.PORT} is already in use`));
		}
		app.log.error(err);
		await app.close();
		process.exit(1);
	}
};
