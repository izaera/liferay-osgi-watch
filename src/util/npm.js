'use strict';

const childProcess = require('child_process');

const getNpmChildProcess = args => {
	const cwd = process.cwd();

	return childProcess.spawn('npm', args, { cwd });
};

module.exports = args => {
	return new Promise((resolve, reject) => {
		const cp = getNpmChildProcess(args);
		let npmOutput = '';
		cp.stdout.on('data', data => {
			npmOutput += data.toString();
		});
		cp.stderr.pipe(process.stderr);
		cp.on('exit', code => {
			if (code === 0) {
				resolve(npmOutput);
			} else {
				reject(new Error('Unable to call npm ' + args.join(' ')));
			}
		});
	});
};
