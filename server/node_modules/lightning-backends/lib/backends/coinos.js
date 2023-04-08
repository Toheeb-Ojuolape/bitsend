const assert = require('assert');
const HttpLightningBackend = require('../HttpLightningBackend');

class Backend extends HttpLightningBackend {

	static name = 'coinos';

	constructor(options) {
		options = options || {};
		super(Backend.name, options, {
			defaultOptions: {
				baseUrl: null,
				hostname: 'coinos.io',
				protocol: 'https',
				responseType: null,
				requestContentType: 'json',
				jwt: null,
			},
			requiredOptions: ['jwt'],
		});
		const { jwt } = this.options;
		this.options.headers['Authorization'] = `Bearer ${jwt}`;
	}

	checkOptions(options) {
		assert.strictEqual(typeof options.jwt, 'string', 'Invalid option ("jwt"): String expected');
		HttpLightningBackend.prototype.checkOptions.call(this, options);
	}

	payInvoice(invoice) {
		return this.request('post', '/api/lightning/send', {
			payreq: invoice,
		}).then(result => {
			assert.ok(result.hash, 'Unexpected response from LN Backend [POST /api/lightning/send]: Missing "hash"');
			let preimage = result.preimage || null;
			return { id: null, preimage };
		});
	}

	addInvoice(amount, extra) {
		return this.request('post', '/api/lightning/invoice', {
			amount: Math.floor(amount / 1000),// convert to sats
			memo: extra.description,
		}).then(result => {
			return {
				id: null,
				invoice: result,
			};
		});
	}

	getBalance() {
		return Promise.reject(new Error('Not supported by this LN service.'));
	}

	getInvoiceStatus(paymentHash) {
		return Promise.reject(new Error('Not supported by this LN service.'));
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
			'no_route',
		],
		notOk: [
			'Socks5 proxy rejected connection - Failure',
			'Unauthorized',
		],
	},
};

Backend.form = {
	label: 'CoinOS',
	inputs: [
		{
			name: 'baseUrl',
			label: 'Base URL',
			help: 'Keep the default value unless you are hosting your own instance.',
			type: 'text',
			placeholder: 'https://coinos.io',
			default: 'https://coinos.io',
			required: true,
		},
		{
			name: 'jwt',
			label: 'JWT Auth Token',
			help: 'From your coinos wallet, go to "Settings" then "Auth keys" to view the "JWT Auth Token"',
			type: 'text',
			placeholder: 'xxx',
			default: '',
			required: true,
		},
	],
};

module.exports = Backend;
