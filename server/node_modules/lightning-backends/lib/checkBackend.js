const assert = require('assert');
const generatePaymentRequest = require('./generatePaymentRequest');
const prepareBackend = require('./prepareBackend');

const normalizeRegex = /^HttpLightningBackend \[[a-zA-Z0-9\-_]+\] Request Failed:/;
const normalizeErrorMessage = function(message) {
	if (normalizeRegex.test(message)) {
		// Remove the first two lines.
		message = message.split('\n').slice(2).join('\n').trim();
	}
	return message;
};

module.exports = function(backend, config, options) {
	return Promise.resolve().then(() => {
		options = Object.assign({
			method: 'payInvoice',
			network: 'bitcoin',
		}, options || {});
		assert.strictEqual(typeof options, 'object', 'Invalid argument ("options"): Object expected');
		assert.strictEqual(typeof options.method, 'string', 'Invalid option ("method"): String expected');
		const ln = prepareBackend(backend, config);
		const { method } = options;
		const fn = ln[method];
		assert.strictEqual(typeof fn, 'function', `Invalid option ("method"): Unknown method "${method}"`);
		let args = [];
		switch (method) {
			case 'payInvoice':
				// Create an invoice with a randomly generated node key.
				// A successful check is a failed payment due to no route or some other similar error.
				// A failed check is a bad auth error or some other unexpected error response.
				const millisatoshis = 1000;
				const { network } = options;
				const invoice = generatePaymentRequest(millisatoshis, { network });
				args.push(invoice);
				break;
			default:
				throw new Error(`Testing the "${method}" method is not supported`);
		}
		return fn.apply(ln, args).then(() => {
			// Success response from the backend. Consider the check successful.
			return { ok: true };
		}).catch(error => {
			// An error response from the backend.
			// Whether the check was successful depends on the error.
			const regex = ln.checkMethodErrorRegEx[method];
			if (regex.ok && regex.ok.test(error.message)) {
				return { ok: true };
			}
			if (regex.notOk && regex.notOk.test(error.message)) {
				const message = normalizeErrorMessage(error.message);
				return { ok: false, message };
			}
			// Some unexpected error occurred.
			// Re-throw and let whatever called this method to catch it.
			throw error;
		});
	});
};
