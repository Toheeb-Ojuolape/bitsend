const assert = require('assert');
const LightningBackend = require('./LightningBackend');
const net = require('net');

let clientIncrement = 0;

class JsonRpcLightningBackend extends LightningBackend {

	constructor(name, options, classOptions) {
		super(name, options, classOptions);
		this.clientId = ['client', ++clientIncrement].join('-');
		this.cmdIncrement = 0;
	}

	checkOptions(options) {
		assert.strictEqual(typeof options.unixSockPath, 'string', 'Invalid option ("unixSockPath"): String expected');
		assert.strictEqual(typeof options.jsonrpc, 'string', 'Invalid option ("jsonrpc"): String expected');
		assert.strictEqual(options.jsonrpc, '2.0', 'Invalid option ("jsonrpc"): Only JSON-RPC 2.0 is supported')
		assert.strictEqual(typeof options.delimiter, 'string', 'Invalid option ("delimiter"): String expected');
	}

	openSocketConnection(unixSockPath) {
		return new Promise((resolve, reject) => {
			try {
				const socket = net.connect(unixSockPath, () => resolve(socket));
				socket.once('error', reject);
			} catch (error) {
				return reject(error);
			}
		});
	}

	// https://www.jsonrpc.org/specification
	cmd(method, params) {
		return Promise.resolve().then(() => {
			assert.ok(method, 'Missing required argument: "method"');
			assert.strictEqual(typeof method, 'string', 'Invalid argument ("method"): String expected');
			params = params || [];
			assert.ok(params instanceof Array || typeof params === 'object', 'Invalid argument ("params"): Array or Object expected');
			const { clientId, options } = this;
			const { delimiter, jsonrpc, unixSockPath } = options;
			return this.openSocketConnection(unixSockPath).then(socket => {
				return new Promise((resolve, reject) => {
					const id = [clientId, 'cmd', ++this.cmdIncrement].join('-');
					const done = (error, result) => {
						socket.destroy();
						if (error) return reject(error);
						resolve(result);
					};
					const onData = data => {
						const messages = data.toString().trim().split('\n');
						messages.forEach(message => {
							let json;
							try { json = JSON.parse(message); } catch (error) {
								// Ignore JSON parsing errors.
							}
							if (json && json.id && json.id === id) {
								if (json.error) {
									return done(new Error(JSON.stringify(json.error)));
								}
								return done(null, json.result);
							}
						});
					};
					socket.on('data', onData);
					socket.write(JSON.stringify({ jsonrpc, method, params, id }) + delimiter);
				});
			}).catch(error => {
				if (/connect EACCES/.test(error.message)) {
					throw new Error('Could not connect to unix sock: Permission denied');
				} else if (/connect ENOENT/.test(error.message)) {
					throw new Error('Could not connect to unix sock: File not found');
				}
				throw error;
			});
		});
	}
};

JsonRpcLightningBackend.prototype.defaultOptions = {
	unixSockPath: null,
	jsonrpc: '2.0',
	delimiter: '\n',
};

JsonRpcLightningBackend.prototype.requiredOptions = ['unixSockPath'];

module.exports = JsonRpcLightningBackend;
