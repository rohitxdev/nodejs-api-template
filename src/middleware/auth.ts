import { type preHandlerAsyncHookHandler } from 'fastify';
import httpStatus from 'http-status';

import { roles } from '../constants/roles.js';
import { getUserFromId } from '../services/auth.service.js';
import { type UserRole } from '../types/user.js';

export const auth = (requiredUserRole: UserRole) => {
	const fn: preHandlerAsyncHookHandler = async (request, reply) => {
		const user = await getUserFromId(1);
		const rolesList = Object.keys(roles);
		const hasAcess = rolesList.indexOf(user.role) >= rolesList.indexOf(requiredUserRole);
		if (!hasAcess) {
			return reply.status(httpStatus.FORBIDDEN).send();
		}
		request.user = user;
		return;
	};
	return fn;
};
