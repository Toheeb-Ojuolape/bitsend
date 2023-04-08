const assert = require('assert');
const prepareSignedQuery = require('./prepareSignedQuery');
const prepareQueryPayloadString = require('./prepareQueryPayloadString');

module.exports = function(apiKey, tag, params, options) {
	options = Object.assign({}, {
		// The externally reachable URL w/ endpoint for your server (e.g "https://example.com/lnurl"):
		baseUrl: null,
	}, options || {});
	assert.ok(options.baseUrl, 'Missing required option: "baseUrl"');
	assert.strictEqual(typeof options.baseUrl, 'string', 'Invalid option ("baseUrl"): String expected');
	const query = prepareSignedQuery(apiKey, tag, params, options);
	const signedUrl = `${options.baseUrl}?` + prepareQueryPayloadString(query);
	return signedUrl;
};
