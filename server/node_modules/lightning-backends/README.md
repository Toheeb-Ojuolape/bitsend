# lightning-backends

![Build Status](https://github.com/bleskomat/lightning-backends-node/actions/workflows/tests.yml/badge.svg)

Node.js module to integrate with various Lightning Network node software and service providers.

* [List of Backends](#list-of-backends)
* [Installation](#installation)
* [Usage](#usage)
	* [Backend Configuration Options](#backend-configuration-options)
	* [Custom Backend](#custom-backend)
* [Tests](#tests)
* [Changelog](#changelog)
* [License](#license)


## List of Backends

The following list includes all the Lightning Network node software and service providers which are supported:
* [Lightning Network Daemon (lnd)](https://github.com/LightningNetwork/lnd)
* [C-Lightning](https://github.com/ElementsProject/lightning) - JSON-RPC interface over unix sock or HTTP-RPC interface made available by [Sparko plugin](https://github.com/fiatjaf/sparko)
* [coinos](https://coinos.io/home)
* [lnbits](https://github.com/lnbits/lnbits-legend)
* [lndhub](https://github.com/BlueWallet/LndHub)
* [lnpay](https://lnpay.co/)
* [lntxbot](https://github.com/fiatjaf/lntxbot)
* [opennode](https://www.opennode.com/)


## Installation

Add to your application via `npm`:
```bash
npm install lightning-backends
```


## Usage

```js
const { checkBackend, prepareBackend } = require('lightning-backends');

const backend = 'lnd';
const config = {
	hostname: '127.0.0.1:8080',
	protocol: 'https',
	cert: '/path/to/lnd/tls.cert',
	macaroon: '/path/to/lnd/admin.macaroon',
};

const ln = prepareBackend(backend, config);

// Pay a Lightning invoice.
ln.payInvoice(invoice).then(result => {
	// `{ id: null }`
	// `{ id: 'custom-unique-identifier' }`
	console.log('payInvoice OK', { result });
}).catch(error => {
	console.error('payInvoice FAILED:', { error });
});

// Request a new Lightning invoice from the backend.
ln.addInvoice(21000/* msat */).then(result => {
	// `{ id: null, invoice: <bolt11-invoice> }`
	// `{ id: 'custom-unique-identifier', invoice: <bolt11-invoice> }`
	console.log('addInvoice OK', { result });
}).catch(error => {
	console.error('addInvoice FAILED:', { error });
});

// Get the current status of an invoice by its payment hash or unique identifier.
// Some backends require the use of a unique identifier instead of payment hash.
// If the `addInvoice` method returns an `id` then use tha instead of the payment hash here.
ln.getInvoiceStatus(paymentHash).then(result => {
	// `{ preimage: null, settled: false }`
	// `{ preimage: '23b1a130cdc61f869674fdc4a64e8de5da1d4666', settled: true }`
	console.log('getInvoiceStatus OK', { result });
}).catch(error => {
	console.error('getInvoiceStatus FAILED:', { error });
});

// Get current spendable Lightning balance.
ln.getBalance().then(result => {
	// `result` will be the balance in millisatoshis.
	console.log('getBalance OK', { result });
}).catch(error => {
	console.error('getBalance FAILED:', { error });
});

// Open a new channel.
// Most backends do not support this method.
ln.openChannel(remoteId, localAmt, pushAmt, makePrivate).then(result => {
	// `result` can vary depending upon the backend used.
	console.log('openChannel OK', { result });
}).catch(error => {
	console.error('openChannel FAILED:', { error });
});

// Attempt to pay a 1000 msat invoice for a randomly generated node private key.
// Since the node doesn't exist, it will always fail.
// If the error is "no_route" or some other similar error, then the check is passed.
// Failed authentication or any unexpected errors are considered a failed check.
checkBackend(backend, config, { method: 'payInvoice' }).then(result => {
	console.log('Backend configuration check', result.ok ? 'OK' : 'FAILED', { result });
});
```


### Backend Configuration Options

Lightning Network Daemon (lnd):
* __hostname__ - The host and port of the node's REST API. Examples:
	* `127.0.0.1:8080`
	* `esdlkvxdkwxz6yqs6rquapg4xxt4pt4guj24k75pdnquo5nau135ugyd.onion`
* __protocol__ - "http" or "https" - Must be "https" unless an onion address is used.
* __baseUrl__ - The full URL and path of the node's REST API. Can be used instead of the hostname and protocol options above. Examples:
	* `https://127.0.0.1:8080/custom/path`
	* `http://esdlkvxdkwxz6yqs6rquapg4xxt4pt4guj24k75pdnquo5nau135ugyd.onion/custom/path`
* __cert__ - The TLS certificate of the lnd node. Examples:
	* `/path/to/lnd/tls.cert` - As a file path.
	* `{ data: 'STRING_UTF8_ENCODED' }` - As a string.
	* `{ data: Buffer.from('STRING_UTF8_ENCODED', 'utf8') }` - As a buffer.
* __macaroon__ - The authentication macaroon to access the lnd node's REST API. Examples:
	* `/path/to/lnd/admin.macaroon` - As a file path.
	* `{ data: 'STRING_HEX_ENCODED' }` - As a string.
	* `{ data: Buffer.from('STRING_HEX_ENCODED', 'hex') }` - As a buffer.
* __torSocksProxy__ - If hostname contains an onion address, the backend will try to connect to it using the the TOR socks proxy. Default:
	* `127.0.0.1:9050`

C-Lightning (unix sock):
* __unixSockPath__ - The absolute file path to the unix sock of c-lightning. Example:
	* `/path/to/unix/sock/.lightning/lightning-rpc`

C-Lightning (Sparko):
* __baseUrl__ - Full URL and path of the Sparko plugin's HTTP-RPC API. Onion addresses are supported. Examples:
	* `https://127.0.0.1:9737/rpc`
	* `http://esdlkvxdkwxz6yqs6rquapg4xxt4pt4guj24k75pdnquo5nau135ugyd.onion/rpc`
* __cert__ - The TLS certificate used by the Sparko plugin.
* __accessKey__ - See `--sparko-keys=` in your lightningd config.

coinos:
* __baseUrl__ - The URL of the CoinOS instance. Example:
	* `https://coinos.io`
* __jwt__ - From your coinos wallet, go to "Settings" -> "Auth keys" to view the "JWT Auth Token".

lnbits:
* __baseUrl__ - The URL of the LNBits instance. Example:
	* `https://legend.lnbits.com`
* __adminKey__ - From an account page, open "API info" to view the "Admin key".

lndhub:
* __secret__ - If using BlueWallet, go to wallet then "Export/Backup" to view the secret. Example:
	* `lndhub://login:password@baseurl`

lnpay:
* __apiKey__
* __walletKey__

lntxbot:
* __adminKey__ - Open Telegram, open the chat with LNTXBOT, send message to the bot "/api_full".

opennode:
* __apiKey__



#### Custom Backend

It is possible to define your own custom backend to use with this module. To do so, create a new file and save it in your project:
```js
// ./backends/custom.js

const { LightningBackend } = require('lightning-backends/lib');

class Backend extends LightningBackend {

	static name = 'custom';

	constructor(options) {
		super(Backend.name, options, {
			defaultOptions: {
				customOption1: 'a default value',
			},
			requiredOptions: ['customOption1'],
		});
	}

	checkOptions(options) {
		// This is called by the constructor.
		// Throw an error if any problems are found with the given options.
	}

	getNodeUri() {
		// Options are available as follows:
		const { customOption1 } = this.options;
		return Promise.reject('Not implemented');
	}

	openChannel(remoteId, localAmt, pushAmt, makePrivate) {
		return Promise.reject('Not implemented');
	}

	payInvoice(invoice) {
		return Promise.reject('Not implemented');
	}

	addInvoice(amount, extra) {
		return Promise.reject('Not implemented');
	}

	getInvoiceStatus(paymentHash) {
		return Promise.reject('Not implemented');
	}
};

module.exports = Backend;
```
Then to use your custom backend:
```js
const { prepareBackend } = require('lightning-backends');

const backend = './backends/custom.js';
const config = {};

const ln = prepareBackend(backend, config);

ln.payInvoice(invoice).then(() => {
	console.log('payInvoice OK', { result });
}).catch(error => {
	console.error('payInvoice FAILED:', { error });
});
```


## Tests

Run automated tests as follows:
```bash
npm test
```


## Changelog

See [CHANGELOG.md](https://github.com/bleskomat/lightning-backends-node/blob/master/CHANGELOG.md)


## License

This software is [MIT licensed](https://tldrlegal.com/license/mit-license):
> A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.  There are many variations of this license in use.
