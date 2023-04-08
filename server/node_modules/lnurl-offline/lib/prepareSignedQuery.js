const assert = require('assert');
const createSignature = require('./createSignature');
const crypto = require('crypto');
const prepareQueryPayloadString = require('./prepareQueryPayloadString');
const shortenQuery = require('./shortenQuery');

module.exports = function(apiKey, tag, params, options) {
	options = Object.assign({}, {
		// The algorithm to use when creating the signature via HMAC:
		algorithm: 'sha256',
		// The number of random bytes to use when generating the nonce:
		nonceBytes: 10,
		// Before the signature is created, override any querystring parameter:
		overrides: {},
		// Whether or not to shorten the querystring parameters.
		// This helps with scannability when encoding the URL as a QR code.
		shorten: false,
	}, options || {});
	assert.ok(apiKey, 'Missing required argument: "apiKey"');
	assert.strictEqual(typeof apiKey, 'object', 'Invalid argument ("apiKey"): Object expected');
	assert.ok(apiKey.id, 'Missing "apiKey.id"');
	assert.ok(apiKey.key, 'Missing "apiKey.key"');
	assert.ok(tag, 'Missing required argument: "tag"');
	assert.strictEqual(typeof tag, 'string', 'Invalid argument ("tag"): String expected');
	params = params || {};
	assert.strictEqual(typeof params, 'object', 'Invalid argument ("params"): Object expected');
	const { id, encoding } = apiKey;
	let { key } = apiKey;
	if (encoding) {
		key = Buffer.from(key, encoding);
	}
	const nonce = crypto.randomBytes(options.nonceBytes).toString('hex');
	let query = Object.assign({ id, nonce, tag }, params, options.overrides || {});
	Object.entries(query).forEach(([key, value], index) => {
		// JavaScript objects should be stringified.
		if (typeof value === 'object') {
			query[key] = JSON.stringify(value);
		}
	});
	// The query object should be stringified in a standardized way.
	// This is needed to ensure consistent signing between device and server.
	const payload = prepareQueryPayloadString(query);
	query.signature = createSignature(payload, key, options.algorithm);
	if (options.shorten) {
		query = shortenQuery(query);
	}
	return query;
};
