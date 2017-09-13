'use strict';

const configs = require('../util/configs');
const gulp = require('gulp');
const log = require('../util/log');
const npm = require('../util/npm');
const path = require('path');

gulp.task('build-javascript-npm', [], done => {
	const start = process.hrtime();
	const srcDir = path.join(
		process.cwd(),
		'build/resources/main/META-INF/resources',
	);

	log.info('build-javascript-npm', 'Running `npm run build`');

	npm(['run', 'build'])
		.then(output => {
			gulp
				.src(`${srcDir}/**/*`)
				.pipe(
					gulp.dest(
						path.join(configs.pathExploded, 'META-INF/resources'),
					),
				)
				.on('end', () => {
					log.duration('build-npm', start);

					done();
				});
		})
		.catch(err => log.error('build-npm', err));
});
