import chalk from 'chalk';

export const connectToDb = async () => {
	// console.log(chalk.green.bold('>> Connecting to database...'));
	try {
		// console.log(chalk.green.bold('>> Connected to database successfully ✅'));
	} catch (err) {
		console.log(chalk.red.bold('>> Could not connect to database ❌'));
	}
};
