const assert = require('assert');
const crypto = require('crypto');
const generatePaymentRequest = require('../generatePaymentRequest');
const LightningBackend = require('../LightningBackend');

class Backend extends LightningBackend {

	static name = 'dummy';

	constructor(options) {
		super(Backend.name, options, {
			defaultOptions: {
				alwaysFail: false,
				useIdentifier: false,
				nodeUri: 'PUBKEY@127.0.0.1:9735',
				preimage: null,
				settled: true,
				balance: 50000,
			},
			requiredOptions: [],
		});
		this.requestCounters = {};
	}

	resetRequestCounters() {
		return this.requestCounters = {};
	}

	getRequestCount(method) {
		return this.requestCounters[method] || 0;
	}

	incrementRequestCounter(method) {
		if (typeof this.requestCounters[method] === 'undefined') {
			this.requestCounters[method] = 0;
		}
		this.requestCounters[method]++;
	}

	getNodeUri() {
		return Promise.resolve().then(() => {
			this.incrementRequestCounter('getNodeUri');
			assert.ok(!this.options.alwaysFail, 'getNodeUri failure');
			return this.options.nodeUri;
		});
	}

	openChannel(remoteId, localAmt, pushAmt, makePrivate) {
		return Promise.resolve().then(() => {
			this.incrementRequestCounter('openChannel');
			assert.ok(!this.options.alwaysFail, 'openChannel failure');
			return {};
		});
	}

	payInvoice(invoice) {
		return Promise.resolve().then(() => {
			this.incrementRequestCounter('payInvoice');
			assert.ok(!this.options.alwaysFail, 'payInvoice failure');
			let id = null;
			if (this.options.useIdentifier) {
				id = crypto.randomBytes(32).toString('hex');
			}
			let preimage = this.options.preimage || null;
			if (Buffer.isBuffer(preimage)) {
				preimage = preimage.toString('hex');
			}
			return { id, preimage };
		});
	}

	addInvoice(amount, extra) {
		return Promise.resolve().then(() => {
			this.incrementRequestCounter('addInvoice');
			assert.ok(!this.options.alwaysFail, 'addInvoice failure');
			const { description, descriptionHash } = extra || {};
			const { preimage } = this.options;
			const invoice = generatePaymentRequest(amount, { description, descriptionHash, preimage });
			let id = null;
			if (this.options.useIdentifier) {
				id = crypto.randomBytes(32).toString('hex');
			}
			return { id, invoice };
		});
	}

	getInvoiceStatus(paymentHash) {
		return Promise.resolve().then(() => {
			this.incrementRequestCounter('getInvoiceStatus');
			assert.ok(!this.options.alwaysFail, 'getInvoiceStatus failure');
			let { preimage, settled } = this.options;
			if (!preimage) {
				preimage = crypto.randomBytes(20);
			}
			if (Buffer.isBuffer(preimage)) {
				preimage = preimage.toString('hex');
			}
			return { preimage, settled };
		});
	}

	getBalance() {
		return Promise.resolve(this.options.balance);
	}
};

Backend.prototype.checkMethodErrorMessages = {
	payInvoice: {
		ok: [
		],
		notOk: [
			'Socks5 proxy rejected connection - Failure',
			'payInvoice failure',
		],
	},
};

module.exports = Backend;
