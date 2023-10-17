import { type User } from '../types/user.js';

export const getUserFromId = async (id: number): Promise<User> => {
	return { id, role: 'USER' };
};
