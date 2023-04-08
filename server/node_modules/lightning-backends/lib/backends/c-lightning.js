const assert = require('assert');
const crypto = require('crypto');
const JsonRpcLightningBackend = require('../JsonRpcLightningBackend');

class Backend extends JsonRpcLightningBackend {

	static name = 'c-lightning';

	constructor(options) {
		options = options || {};
		super(Backend.name, options, {
			defaultOptions: {},
			requiredOptions: ['unixSockPath'],
		});
	}

	// https://lightning.readthedocs.io/lightning-getinfo.7.html
	getNodeUri() {
		return this.cmd('getinfo').then(result => {
			assert.strictEqual(typeof result, 'object', 'Unexpected response from LN Backend [getinfo]');
			const { id, address } = result;
			assert.ok(id, 'Unexpected response from LN Backend [invoice]: Missing "id"');
			assert.notStrictEqual(typeof address, 'undefined', 'Unexpected response from LN Backend [invoice]: Missing "address"');
			if (address.length === 0) {
				return null;
			}
			const { type, port } = address[0];
			let host = address[0].address;
			if (type === 'ipv6') {
				host = `[${host}]`;
			}
			const hostname = `${host}:${port}`;
			return `${id}@${hostname}`;
		});
	}

	// https://lightning.readthedocs.io/lightning-fundchannel.7.html
	// https://github.com/ElementsProject/lightning/blob/master/doc/lightning-fundchannel.7.md
	openChannel(remoteId, localAmt, pushAmt, makePrivate) {
		return this.cmd('fundchannel', {
			id: remoteId,
			amount: localAmt,
			announce: !makePrivate,
			push_msat: pushAmt * 1000,
		});
	}

	// https://lightning.readthedocs.io/lightning-pay.7.html
	// https://github.com/ElementsProject/lightning/blob/master/doc/lightning-pay.7.md
	payInvoice(invoice) {
		return this.cmd('pay', { bolt11: invoice }).then(result => {
			const preimage = result.payment_preimage || null;
			return { id: null, preimage };
		});
	}

	// https://lightning.readthedocs.io/lightning-invoice.7.html
	// https://github.com/ElementsProject/lightning/blob/master/doc/lightning-invoice.7.md
	addInvoice(amount, extra) {
		const { description, descriptionHash } = extra;
		const params = {
			msatoshi: amount,
			label: crypto.randomBytes(20).toString('hex'),// random and unique
			description,
			deschashonly: true,
		};
		return this.cmd('invoice', params).then(result => {
			assert.ok(result.bolt11, 'Unexpected response from LN Backend [invoice]: Missing "bolt11"');
			return {
				id: null,
				invoice: result.bolt11,
			};
		});
	}

	// https://lightning.readthedocs.io/lightning-listinvoices.7.html
	// https://github.com/ElementsProject/lightning/blob/master/doc/lightning-listinvoices.7.md
	getInvoiceStatus(paymentHash) {
		const params = {
			payment_hash: paymentHash,
		};
		return this.cmd('listinvoices', params).then(result => {
			assert.strictEqual(typeof result, 'object', `Unexpected response from LN Backend [listinvoices ${paymentHash}]`);
			assert.ok(result.invoices instanceof Array, `Unexpected response from LN Backend [listinvoices ${paymentHash}]: Missing "invoices" array`);
			assert.ok(result.invoices.length > 0, `Unexpected response from LN Backend [listinvoices ${paymentHash}]: Invoice not found`);
			const { status, payment_preimage } = result.invoices[0];
			assert.notStrictEqual(typeof status, 'undefined', `Unexpected response from LN Backend [listinvoices ${paymentHash}]: Missing "status"`);
			const preimage = payment_preimage || null;
			const settled = status === 'paid';
			return { preimage, settled };
		});
	}

	// https://lightning.readthedocs.io/lightning-listfunds.7.html
	getBalance() {
		return this.cmd('listfunds').then(result => {
			assert.strictEqual(typeof result, 'object', 'Unexpected response from LN Backend [listfunds]');
			assert.ok(result.channels instanceof Array, 'Unexpected response from LN Backend [listfunds]: Missing "channels" array');
			let balance = 0;
			result.channels.filter(channel => channel.state === 'CHANNELD_NORMAL').forEach(channel => {
				const { our_amount_msat } = channel;
				const msat = parseInt(our_amount_msat.substr(0, our_amount_msat.length - 'msat'.length));
				if (Number.isInteger(msat)) {
					balance += msat;
				}
			});
			return balance;
		});
	}
};

Backend.prototype.checkMethodErrorMessages = {
	payInvoice: {
		ok: [
			'not reachable directly and all routehints were unusable',
			'No path found',
			'failed: WIRE_TEMPORARY_CHANNEL_FAILURE (reply from remote)',
			'Cannot split payment any further',
		],
		notOk: [
			'Could not connect to unix sock',
			'Prefix bc is not for testnet',
		],
	},
};

Backend.form = {
	label: 'C-Lightning',
	inputs: [
		{
			name: 'unixSockPath',
			label: 'Unix Sock',
			help: 'The absolute file path to the unix sock of c-lightning',
			type: 'text',
			default: '',
			required: true,
		},
	],
};

module.exports = Backend;
