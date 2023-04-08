const crypto = require('crypto');

module.exports = function(options, defaultOptions) {
	defaultOptions = defaultOptions || {};
	options = Object.assign({}, defaultOptions, {
		encoding: 'hex',
	}, options || {});
	const numBytes = Object.assign({}, {
		id: 5,
		key: 32,
	}, defaultOptions.numBytes || {}, options.numBytes || {});
	const { encoding } = options;
	const id = crypto.randomBytes(numBytes.id).toString(encoding);
	const key = crypto.randomBytes(numBytes.key).toString(encoding);
	return { id, key, encoding };
};
