import cluster from 'node:cluster';
import os from 'node:os';
import { setTimeout } from 'node:timers/promises';

import chalk from 'chalk';

import { run } from './app.js';
import { env } from './constants/env.js';

const cleanUpFn = () => {
	//Cleanup logic here
};

const addExitListener = (fn: (signal: NodeJS.Signals) => void) => {
	(['SIGINT', 'SIGTERM'] as NodeJS.Signals[]).forEach((signal) => {
		process.on(signal, fn);
	});
};

const setUpCluster = async () => {
	if (cluster.isWorker) {
		addExitListener(() => {
			cleanUpFn();
			console.log(chalk.bold.grey(`>> Shut down WORKER ${process.pid}`));
			process.exit(0);
		});
		return await run();
	}

	const intialWorkerPIDs: number[] = [];

	for (let i = 0; i < Math.min(env.MAX_INSTANCES, os.cpus().length); i++) {
		const worker = cluster.fork();
		if (worker.process.pid) {
			intialWorkerPIDs.push(worker.process.pid);
		}
	}

	cluster.on('exit', async (worker) => {
		console.log(
			chalk.bold.red(`>> Worker ${worker.process.pid} died unexpectedly. Restarting in 5s...`)
		);
		await setTimeout(5000);
		const newWorker = cluster.fork();
		console.log(chalk.bold.white(`>> Spun up a new worker - ${newWorker.process.pid}`));
	});

	cluster.once('message', async (_, message) => {
		const { address } = message;
		if (address) {
			console.log(
				chalk.bold.green(
					`>> Server listening @ ${chalk.underline.bold.green(
						(address as string).replace('0.0.0.0', '127.0.0.1')
					)}\n`
				)
			);
		}
	});

	console.log(
		`\n${chalk.white.bold('<-- environment variables in')} ${chalk.bold.magenta(
			env.NODE_ENV.toLocaleUpperCase()
		)} ${chalk.white.bold('environment -->')}`
	);
	console.table(
		Object.entries(env).map(([key, value]) => ({
			KEY: key,
			VALUE: value,
		}))
	);
	console.log(
		chalk.bold.white(
			`>> Spun up ${intialWorkerPIDs.length} worker(s) with PID(s) - ${intialWorkerPIDs.join(', ')}`
		)
	);
};

await setUpCluster();
