const assert = require('assert');

module.exports = function(value) {
	assert.strictEqual(typeof value, 'string', 'Invalid argument ("value"): String expected.');
	return Buffer.from(value, 'hex').toString('hex') === value.toLowerCase();
};
