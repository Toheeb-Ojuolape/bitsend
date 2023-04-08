const assert = require('assert');
const HttpLightningBackend = require('../HttpLightningBackend');

class Backend extends HttpLightningBackend {

	static name = 'lnpay';

	constructor(options) {
		options = options || {};
		super(Backend.name, options, {
			defaultOptions: {
				apiKey: null,
				baseUrl: null,
				hostname: 'cloud.lnpay.co',
				protocol: 'https',
				requestContentType: 'json',
				walletKey: null,
			},
			requiredOptions: ['apiKey', 'walletKey'],
		});
		const apiKey = Buffer.from(this.options.apiKey + ':', 'utf8').toString('base64');
		this.options.headers['Authorization'] = `Basic ${apiKey}`;
	}

	checkOptions(options) {
		assert.strictEqual(typeof options.apiKey, 'string', 'Invalid option ("apiKey"): String expected');
		assert.strictEqual(typeof options.walletKey, 'string', 'Invalid option ("walletKey"): String expected');
		HttpLightningBackend.prototype.checkOptions.call(this, options);
	}

	// https://docs.lnpay.co/api/wallet-transactions/pay-invoice
	payInvoice(invoice) {
		const walletKey = encodeURIComponent(this.options.walletKey);
		return this.request('post', `/v1/wallet/${walletKey}/withdraw`, {
			payment_request: invoice,
		}).then(result => {
			assert.ok(result.lnTx && result.lnTx.id, 'Unexpected response from LN Backend [POST /v1/wallet/:wallet_key/withdraw]: Missing "lnTx.id"');
			const { id } = result.lnTx;
			const preimage = result.lnTx.payment_preimage || null;
			return { id, preimage };
		}).catch(error => {
			// Remove sensitive authentication credentials from the error message.
			// This error will probably be written to a log.
			const scrubbedErrorMessage = error.message.replace(new RegExp(this.options.walletKey, 'g'), 'waka_XXXXXXX');
			throw new Error(scrubbedErrorMessage);
		});
	}

	// https://docs.lnpay.co/api/wallet-transactions/generate-invoice
	addInvoice(amount, extra) {
		const walletKey = encodeURIComponent(this.options.walletKey);
		return this.request('post', `/v1/wallet/${walletKey}/invoice`, {
			description_hash: extra.descriptionHash || '',
			num_satoshis: Math.floor(amount / 1000),// convert to sats
		}).then(result => {
			assert.ok(result.id, 'Unexpected response from LN Backend [POST /v1/wallet/:wallet_key/invoice]: Missing "id"');
			assert.ok(result.payment_request, 'Unexpected response from LN Backend [POST /v1/wallet/:wallet_key/invoice]: Missing "payment_request"');
			return {
				id: result.id,
				invoice: result.payment_request,
			};
		}).catch(error => {
			// Remove sensitive authentication credentials from the error message.
			// This error will probably be written to a log.
			const scrubbedErrorMessage = error.message.replace(new RegExp(this.options.walletKey, 'g'), 'waka_XXXXXXX');
			throw new Error(scrubbedErrorMessage);
		});
	}

	// https://docs.lnpay.co/api/lntx
	getInvoiceStatus(id) {
		const lntx_id = encodeURIComponent(id);
		return this.request('get', `/v1/lntx/${lntx_id}`).then(result => {
			assert.ok(result, 'Unexpected response from LN Backend [GET /v1/lntx/:lntx_id]');
			const preimage = result.payment_preimage || null;
			const settled = !!preimage;
			return {
				preimage,
				settled,
			};
		});
	}

	// https://docs.lnpay.co/api/wallets/retrieve
	getBalance() {
		const walletKey = encodeURIComponent(this.options.walletKey);
		return this.request('get', `/v1/wallet/${walletKey}`).then(result => {
			return parseInt(result.balance) * 1000;
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
			'FAILURE_REASON_NO_ROUTE',
		],
		notOk: [
			'Socks5 proxy rejected connection - Failure',
			'Unauthorized',
			'Wallet not found',
		],
	},
};

Backend.form = {
	label: 'LNPay',
	inputs: [
		{
			name: 'hostname',
			label: 'Hostname',
			type: 'text',
			default: 'lnpay.co',
			required: true,
		},
		{
			name: 'apiKey',
			label: 'API Key',
			type: 'text',
			placeholder: 'sak_xxx',
			default: '',
			required: true,
		},
		{
			name: 'walletKey',
			label: 'Wallet Key',
			type: 'text',
			placeholder: 'waka_xxx',
			default: '',
			required: true,
		},
	],
};

module.exports = Backend;
