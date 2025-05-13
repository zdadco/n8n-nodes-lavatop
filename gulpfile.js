const path = require('path');
const { task, src, dest } = require('gulp');

task('build:icons', copyIcons);

function copyIcons() {
	const source = path.resolve('icons', '**', '*.{png,svg}');
	const destination = path.resolve('dist', 'icons');

	return src(source).pipe(dest(destination));
}
