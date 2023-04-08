const assert = require('assert');
const HttpLightningBackend = require('../HttpLightningBackend');
const CLightningBackend = require('./c-lightning');
const tlsCheck = require('../tlsCheck');
const tls = require('tls');
const url = require('url');
const { ValidationError } = require('@bleskomat/form');

class Backend extends HttpLightningBackend {

	// https://github.com/fiatjaf/sparko
	static name = 'c-lightning-sparko';

	constructor(options) {
		options = options || {};
		super(Backend.name, options, {
			defaultOptions: {
				requestContentType: 'json',
				responseType: 'json',
			},
			requiredOptions: ['baseUrl', 'accessKey'],
		});
		this.options.headers['X-Access'] = this.options.accessKey;
	}

	getNodeUri() {
		return CLightningBackend.prototype.getNodeUri.apply(this, arguments);
	}

	openChannel() {
		return CLightningBackend.prototype.openChannel.apply(this, arguments);
	}

	payInvoice() {
		return CLightningBackend.prototype.payInvoice.apply(this, arguments);
	}

	addInvoice() {
		return CLightningBackend.prototype.addInvoice.apply(this, arguments);
	}

	getInvoiceStatus() {
		return CLightningBackend.prototype.getInvoiceStatus.apply(this, arguments);
	}

	getBalance() {
		return CLightningBackend.prototype.getBalance.apply(this, arguments);
	}

	cmd(method, params) {
		const data = { method, params };
		const uri = '';
		return this.request('post', uri, data).then(result => {
			return result;
		}).catch(error => {
			if (/Unexpected HTTP response status: 401/i.test(error.message)) {
				throw new Error('Unauthorized');
			}
			throw error;
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
			'Unauthorized',
			'Prefix bc is not for testnet',
			'Socks5 proxy rejected connection - Failure',
		],
	},
};

Backend.form = {
	label: 'C-Lightning (Sparko)',
	inputs: [
		{
			name: 'baseUrl',
			label: 'Base URL',
			help: 'Full URL and path of the Sparko plugin\'s HTTP-RPC API. Onion addresses are supported.',
			type: 'text',
			placeholder: 'https://127.0.0.1:9737/rpc',
			default: '',
			required: true,
			validate: function(value) {
				if (value) {
					let parsedUrl;
					try { parsedUrl = url.parse(value); } catch (error) {
						throw new ValidationError('"Base URL" must be a valid URL - e.g. https://127.0.0.1:9737/rpc');
					}
					const { hostname, protocol } = parsedUrl;
					assert.ok(hostname.substr(-6) === '.onion' || protocol === 'https:', new ValidationError('Except in the case of onion addresses, "Base URL" must use the https protocol.'));
				}
			},
		},
		{
			name: 'cert',
			label: 'TLS Certificate',
			help: 'Automatically retrieved from service at the URL provided above. Please check this against your sparko plugin\'s tls cert file.',
			type: 'textarea',
			default: '',
			readonly: true,
			required: function(data) {
				const baseUrl = data && data['c-lightning-sparko[baseUrl]'] || null;
				return baseUrl && baseUrl.split('://')[0] === 'https';
			},
			validate: function(value, data) {
				if (value) {
					const baseUrl = data && data['c-lightning-sparko[baseUrl]'] || null;
					if (baseUrl) {

						let parsedUrl;
						try { parsedUrl = url.parse(baseUrl); } catch (error) {
							// Base URL not valid. Skip this check.
						}
						const { host } = parsedUrl;
						return tlsCheck(host, {
							requestCert: false,
							rejectUnauthorized: false,
							secureContext: tls.createSecureContext({
								ca: value,
							}),
						}).then(result => {
							assert.ok(result.authorized, new ValidationError(`Unable to establish secure connection to ${host} with the provided TLS certificate`));
						});
					}
				}
			},
			rows: 4,
		},
		{
			name: 'fingerprint',
			label: 'Fingerprint (sha1)',
			type: 'text',
			default: '',
			disabled: true,
		},
		{
			name: 'fingerprint256',
			label: 'Fingerprint (sha256)',
			type: 'text',
			default: '',
			disabled: true,
		},
		{
			name: 'accessKey',
			label: 'Access Key',
			help: 'See "--sparko-keys=" in your lightningd config',
			type: 'text',
			default: '',
			required: true,
		},
	],
};

module.exports = Backend;
