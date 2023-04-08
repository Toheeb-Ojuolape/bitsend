const assert = require('assert');
const tls = require('tls');
const url = require('url');

module.exports = function(host, options) {
	return Promise.resolve().then(() => {
		assert.ok(host, 'Missing required argument: "host"');
		assert.strictEqual(typeof host, 'string', 'Invalid argument ("host"): String expected');
		options = Object.assign({
			timeout: 5000,
			requestCert: true,
			rejectUnauthorized: false,
			secureContext: null,
		}, options || {});
		const { hostname, port } = url.parse(`https://${host}`);
		return new Promise((resolve, reject) => {
			try {
				const { requestCert, rejectUnauthorized, secureContext } = options;
				const client = tls.connect(port, hostname, { requestCert, rejectUnauthorized, secureContext }, () => {
					try {
						let cert = client.getPeerCertificate(true);
						const { fingerprint, fingerprint256 } = cert;
						const { authorized } = client;
						const prefix = '-----BEGIN CERTIFICATE-----\n';
						const postfix = '-----END CERTIFICATE-----';
						let pems = {};
						while (cert.issuerCertificate && typeof pems[cert.fingerprint256] === 'undefined') {
							pems[cert.fingerprint256] = prefix + cert.raw.toString('base64').match(/.{0,64}/g).join('\n') + postfix;
							cert = cert.issuerCertificate;
						}
						const pem = Object.values(pems).join('\n\n');
						done(null, { authorized, fingerprint, fingerprint256, pem });
					} catch (error) {
						return done(error);
					}
				});
				const timeout = setTimeout(function() {
					done(new Error(`Timed-out while connecting to "${host}"`));
				}, options.timeout);
				const done = (error, result) => {
					clearTimeout(timeout);
					client && client.end();
					if (error) return reject(error);
					resolve(result);
				};
				client.once('error', done);
			} catch (error) {
				reject(error);
			}
		});
	});
};
