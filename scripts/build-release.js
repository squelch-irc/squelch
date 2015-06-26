var packager = require('electron-packager');
var argv = require('minimist')(process.argv.slice(2));
var pkg = require ('../package.json');
var _ = require('lodash');

var packagerOpts = {
	dir: '../',
	name: 'Squelch',
	asar: true,
	version: pkg.devDependencies['electron-prebuilt'].match(/\d+\.\d+\.\d/)[0],
	platform: argv.platform || argv.p || process.platform,
	arch: argv.arch || argv.a || process.arch,
	out: '../release',
	ignore: [
	'/test($|/)',
	'/tools($|/)',
	'/release($|/)',
	_.map(pkg.devDependencies, function(version, name) { return '/node_modules/' + name + '($|/)' })
	]
	// TODO: add icon
};

packager(packagerOpts, function(err, path) {
	if(err) { console.error(err); return; }
	console.log('Successfully built package at ' + path);
});