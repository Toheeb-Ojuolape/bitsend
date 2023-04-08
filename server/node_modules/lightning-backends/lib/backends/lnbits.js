const assert = require('assert');
const HttpLightningBackend = require('../HttpLightningBackend');

class Backend extends HttpLightningBackend {

	static name = 'lnbits';

	constructor(options) {
		options = options || {};
		super(Backend.name, options, {
			defaultOptions: {
				baseUrl: null,
				hostname: 'legend.lnbits.com',
				protocol: 'https',
				requestContentType: 'json',
				adminKey: null,
			},
			requiredOptions: ['adminKey'],
		});
		this.options.headers['X-Api-Key'] = encodeURIComponent(this.options.adminKey);
	}

	checkOptions(options) {
		assert.strictEqual(typeof options.adminKey, 'string', 'Invalid option ("adminKey"): String expected');
		HttpLightningBackend.prototype.checkOptions.call(this, options);
	}

	payInvoice(invoice) {
		return this.request('post', '/api/v1/payments', {
			out: true,
			bolt11: invoice,
		}).then(result => {
			assert.ok(result.payment_hash, 'Unexpected response from LN Backend [POST /api/v1/payments]: Missing "payment_hash"');
			const preimage = null;// lnbits never returns a preimage for this request.
			return { id: null, preimage };
		});
	}

	addInvoice(amount, extra) {
		return this.request('post', '/api/v1/payments', {
			out: false,
			amount: Math.floor(amount / 1000),// convert to sats
			description_hash: extra.descriptionHash,
		}).then(result => {
			assert.ok(result.payment_request, 'Unexpected response from LN Backend [POST /api/v1/payments]: Missing "payment_request"');
			return {
				id: null,
				invoice: result.payment_request,
			};
		});
	}

	getInvoiceStatus(paymentHash) {
		const payment_hash = encodeURIComponent(paymentHash);
		return this.request('get', `/api/v1/payments/${payment_hash}`).then(result => {
			assert.ok(result, `Unexpected response from LN Backend [GET /api/v1/payments/${payment_hash}]`);
			const preimage = result.preimage || null;
			const settled = result.paid === true;
			return {
				preimage,
				settled,
			};
		});
	}

	getBalance() {
		return this.request('get', '/api/v1/wallet').then(result => {
			return parseInt(result.balance);
		});
	}

	getNodeUri() {
		return Promise.reject(new Error('Not supported by this LN service.'));
	}

	openChannel(remoteId, localAmt, pushAmt, makePrivate) {
		return Promise.reject(new Error('Not supported by this LN service.'));
	}
};

Backend.prototype.checkMethodErrorMessages = {
	payInvoice: {
		ok: [
			'is not reachable directly and all routehints were unusable',
		],
		notOk: [
			'Socks5 proxy rejected connection - Failure',
			'Insufficient balance',
		],
	},
};

Backend.form = {
	label: 'LNBits',
	inputs: [
		{
			name: 'baseUrl',
			label: 'Base URL',
			help: 'Keep the default value unless you are hosting your own instance.',
			type: 'text',
			placeholder: 'https://legend.lnbits.com',
			default: 'https://legend.lnbits.com',
			required: true,
		},
		{
			name: 'adminKey',
			label: 'Admin Key',
			help: 'From an account page, open "API info" to view the "Admin key"',
			type: 'text',
			placeholder: 'xxx',
			default: '',
			required: true,
		},
	],
};

module.exports = Backend;
