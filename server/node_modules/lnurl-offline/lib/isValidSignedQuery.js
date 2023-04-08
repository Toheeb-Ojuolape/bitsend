const assert = require('assert');
const createSignature = require('./createSignature');
const prepareQueryPayloadString = require('./prepareQueryPayloadString');
const querystring = require('querystring');
const unshortenQuery = require('./unshortenQuery');

module.exports = function(query, key) {
	assert.ok(query, 'Missing required argument: "query"');
	assert.ok(key, 'Missing required argument: "key"');
	if (typeof query === 'string') {
		query = querystring.parse(query);
	}
	assert.strictEqual(typeof query, 'object', 'Invalid argument ("query"): String or Object expected');
	assert.ok(Buffer.isBuffer(key), 'Invalid argument ("key"): Buffer expected');
	query = JSON.parse(JSON.stringify(query));
	query = unshortenQuery(query);
	const { signature } = query;
	assert.ok(signature, 'Missing required query parameter: "signature"');
	delete query.signature;
	const payload = prepareQueryPayloadString(query);
	const result = createSignature(payload, key);
	return signature === result;
};
