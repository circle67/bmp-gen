import cluster from 'cluster';
import { exec } from 'child_process';
import { performance, PerformanceObserver } from 'perf_hooks';

import { deleteAsync } from 'del';

import chalk from 'chalk';

import buildBundle from './build-bundle.js';

const perfObserver = new PerformanceObserver((items) => {
	for (const entry of items.getEntries()) {
		const task = entry.name;
		const status = entry.detail.status;
		const info = entry.detail.info;
		const duration = `${Math.round(entry.duration * 100) / 100}ms`;
		process.stdout.write(`\t${status === 'success' ? chalk.green('✓') : chalk.red('✗')}\t${task}: ${duration}\n${info ? `${info}\n` : ''}`);
	}
});

perfObserver.observe({ entryTypes: ['measure'], buffered: true });

const buildTasks = {
	bundle: 'build:bundle',
	declaration: 'build:declaration'
};

if (cluster.isPrimary) {
	console.log('---    Starting build process    ---');

	// Clean
	performance.mark('clean:start');
	deleteAsync(['lib/*'])
		.then(() => {
			performance.mark('clean:end');
			performance.measure('clean', {
				start: 'clean:start',
				end: 'clean:end',
				detail: {
					status: 'success',
					info: null
				}
			});

			// Build bundle
			performance.mark(`${buildTasks.bundle}:start`);
			cluster.fork({
				buildProcess: buildTasks.bundle
			}).on('exit', (code, signal) => {
				performance.mark(`${buildTasks.bundle}:end`);
				let status;
				if (signal || code !== 0) {
					status = 'failure';
				} else
					status = 'success';
				performance.measure(buildTasks.bundle, {
					start: `${buildTasks.bundle}:start`,
					end: `${buildTasks.bundle}:end`,
					detail: {
						status,
						info: null
					}
				});
			});

			// Generate declaration files
			performance.mark(`${buildTasks.declaration}:start`);
			cluster.fork({
				buildProcess: buildTasks.declaration
			}).on('exit', (code, signal) => {
				performance.mark(`${buildTasks.declaration}:end`);
				let status;
				if (signal || code !== 0) {
					status = 'failure';
				} else
					status = 'success';
				performance.measure(buildTasks.declaration, {
					start: `${buildTasks.declaration}:start`,
					end: `${buildTasks.declaration}:end`,
					detail: {
						status,
						info: null
					}
				});
			});
		})
		.catch((err) => {
			performance.mark('clean:end');
			performance.measure('clean', {
				start: 'clean:start',
				end: 'clean:end',
				detail: {
					status: 'failure',
					info: err
				}
			});
		});
} else if (process.env.buildProcess === buildTasks.bundle) {
	buildBundle()
		.then(() => {
			process.exit(0);
		})
		.catch((err) => {
			throw err;
		});
} else if (process.env.buildProcess === buildTasks.declaration) {
	exec('npx tsc', (err, stdout) => {
		process.stdout.write(stdout);
		if (err)
			throw err;
		process.exit(0);
	});
}