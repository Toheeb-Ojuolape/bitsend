const assert = require('assert');
const HttpLightningBackend = require('../HttpLightningBackend');

class Backend extends HttpLightningBackend {

	static name = 'lntxbot';

	constructor(options) {
		options = options || {};
		super(Backend.name, options, {
			defaultOptions: {
				adminKey: null,
				baseUrl: null,
				hostname: 'lntxbot.com',
				protocol: 'https',
				requestContentType: 'json',
			},
			requiredOptions: ['adminKey'],
		});
		const { adminKey } = this.options;
		this.options.headers['Authorization'] = `Basic ${adminKey}`;
	}

	checkOptions(options) {
		assert.strictEqual(typeof options.adminKey, 'string', 'Invalid option ("adminKey"): String expected');
		HttpLightningBackend.prototype.checkOptions.call(this, options);
	}

	// https://github.com/fiatjaf/lntxbot/blob/6b5d76d8c1d2d57d18b8467557d8e962e1f43a73/bluewallet.go#L106
	payInvoice(invoice) {
		return this.request('post', `/payinvoice`, {
			invoice,
		}).then(result => {
			assert.ok(!result.payment_error, result.payment_error);
			let preimage = null;// lntxbot never returns a preimage for this request.
			return { id: null, preimage };
		});
	}

	// https://github.com/fiatjaf/lntxbot/blob/6b5d76d8c1d2d57d18b8467557d8e962e1f43a73/bluewallet.go#L53
	addInvoice(amount, extra) {
		return this.request('post', `/addinvoice`, {
			amt: Math.floor(amount / 1000).toString(),// convert to sats, must be a string for lntxbot's API to accept.
			description_hash: extra.descriptionHash,
		}).then(result => {
			return {
				id: null,
				invoice: result.payment_request,
			};
		});
	}

	// https://github.com/fiatjaf/lntxbot/blob/2793a588f9a3f0b81cdef7142dbd288cfba5261e/api.go#L116
	getInvoiceStatus(paymentHash) {
		const hash = encodeURIComponent(paymentHash);
		return this.request('get', `/invoicestatus/${hash}`).then(result => {
			assert.ok(!result.error, result.message);
			const preimage = result.preimage || null;
			const settled = !!preimage;
			return {
				preimage,
				settled,
			};
		});
	}

	// https://github.com/fiatjaf/lntxbot/blob/2793a588f9a3f0b81cdef7142dbd288cfba5261e/bluewallet.go#L180
	getBalance() {
		return this.request('get', '/balance').then(result => {
			return parseInt(result['BTC']['AvailableBalance']) * 1000;
		});
	}

	getNodeUri() {
		return Promise.reject(new Error('Not supported by this LN service.'));
	}

	openChannel(remoteId, localAmt, pushAmt, makePrivate) {
		return Promise.reject(new Error('Not supported by this LN service.'));
	}

	validateResponseBody(body) {
		assert.ok(!body.error, JSON.stringify(body));
	}
};

Backend.prototype.checkMethodErrorMessages = {
	payInvoice: {
		ok: [
			'Payment failed',
		],
		notOk: [
			'Socks5 proxy rejected connection - Failure',
			'Insufficient balance',
			'bad auth',
			'Invalid option',
		],
	},
};

Backend.form = {
	label: 'lntxbot',
	inputs: [
		{
			name: 'hostname',
			label: 'Hostname',
			type: 'text',
			default: 'lntxbot.com',
			required: true,
		},
		{
			name: 'adminKey',
			label: 'Admin Key',
			help: 'Open Telegram, open the chat with LNTXBOT, send message to the bot "/api_full"',
			type: 'text',
			placeholder: 'xxx',
			default: '',
			required: true,
		},
	],
};

module.exports = Backend;
