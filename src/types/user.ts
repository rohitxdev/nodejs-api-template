import { roles } from '../constants/roles.js';

export type UserRole = keyof typeof roles;

export interface User {
	id: number;
	role: UserRole;
}
