'use strict';

const buildAmd = require('metal-tools-build-amd/lib/pipelines/buildAmd');
const cache = require('gulp-cached');
const compileSoy = require('metal-tools-soy/lib/pipelines/compileSoy');
const configs = require('../util/configs');
const gulp = require('gulp');
const log = require('../util/log');
const path = require('path');
const plumber = require('gulp-plumber');
const replaceAmdDefine = require('../util/replaceAmdDefine');
const soyDeps = require('../util/soyDeps');

gulp.task('build-soy', [], done => {
	const start = process.hrtime();
	const cfg = configs.builders.sass;

	log.info('build-soy', 'Compiling soy files');

	soyDeps().then(soyDependencies => {
		gulp
			.src(cfg.glob)
			.pipe(plumber())
			.pipe(
				gulp.dest(
					path.join(configs.pathExploded, 'META-INF/resources'),
				),
			)
			.pipe(
				compileSoy({
					handleError: error => console.error(error),
					soyDeps: soyDependencies,
					src: cfg.glob,
				}),
			)
			.pipe(cache('build-soy'))
			.pipe(
				gulp.dest(
					path.join(configs.pathExploded, 'META-INF/resources'),
				),
			)
			.pipe(
				buildAmd({
					base: path.join(configs.pathExploded, 'META-INF/resources'),
					cacheNamespace: 'transpile',
					moduleName: '',
				}),
			)
			.pipe(replaceAmdDefine())
			.pipe(
				gulp.dest(
					path.join(configs.pathExploded, 'META-INF/resources'),
				),
			)
			.on('end', () => {
				log.duration('build-soy', start);
				done();
			});
	});
});
