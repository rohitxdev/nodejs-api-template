import 'fastify';

declare module 'fastify' {
	export interface FastifyRequest {
		user?: {
			role: UserRole;
		};
	}
}
