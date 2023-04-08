const assert = require('assert');
const LightningBackend = require('./LightningBackend');
const path = require('path');

module.exports = function(backend, config) {
	config = config || {};
	if (typeof backend === 'object' && backend.path) {
		backend = backend.path;
	}
	assert.strictEqual(typeof backend, 'string', 'Invalid argument ("backend"): String or Object expected');
	assert.strictEqual(typeof config, 'object', 'Invalid argument ("config"): Object expected');
	let Prototype;
	if (/^[a-z-]+$/i.test(backend)) {
		try { Prototype = require(path.join(__dirname, 'backends', `${backend}.js`)); } catch (error) {
			if (/^Cannot find module/.test(error.message)) {
				throw new Error(`Unknown backend: "${backend}"`);
			}
			throw error;
		}
	} else {
		Prototype = require(path.resolve(backend));
	}
	const ln = new Prototype(config);
	assert.ok(ln instanceof LightningBackend, 'Expected backend to extend from LightningBackend class');
	return ln;
};
