const assert = require('assert');
const bolt11 = require('bolt11');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');

const networks = {
	bitcoin: {
		bech32: 'bc',
		pubKeyHash: 0,
		scriptHash: 5,
		validWitnessVersions: [0]
	},
	testnet: {
		bech32: 'tb',
		pubKeyHash: 111,
		scriptHash: 196,
		validWitnessVersions: [0]
	},
};

module.exports = function(millisatoshis, options) {
	assert.ok(millisatoshis, 'Missing required argument: "millisatoshis"');
	assert.ok(Number.isInteger(parseInt(millisatoshis)), 'Invalid argument ("millisatoshis"): Integer expected');
	millisatoshis = millisatoshis.toString();
	assert.ok(!options || typeof options === 'object', 'Invalid argument ("options"): Object expected');
	options = Object.assign({}, {
		network: 'bitcoin',
		nodePrivateKey: null,
		preimage: null,
		description: null,
		descriptionHash: null,
	}, options || {});
	const preimage = options.preimage || crypto.randomBytes(20);
	let tags = [{
		tagName: 'payment_hash',
		data: crypto.createHash('sha256').update(preimage).digest('hex'),
	}];
	let { description, descriptionHash } = options;
	if (description && !descriptionHash) {
		descriptionHash = crypto.createHash('sha256').update(Buffer.from(description, 'utf8')).digest('hex');
	}
	if (descriptionHash) {
		tags.push({
			tagName: 'purpose_commit_hash',
			data: descriptionHash,
		});
	}
	let { network } = options;
	if (typeof network === 'string') {
		assert.ok(networks[network], `Invalid option ("network"): Unknown network "${network}"`);
		network = networks[network];
	}
	const encoded = bolt11.encode({
		network,
		millisatoshis,
		tags,
	});
	let { nodePrivateKey } = options;
	if (!nodePrivateKey) {
		do {
			nodePrivateKey = crypto.randomBytes(32);
		} while (!secp256k1.privateKeyVerify(nodePrivateKey))
	} else if (typeof nodePrivateKey === 'string') {
		nodePrivateKey = Buffer.from(nodePrivateKey, 'hex');
	}
	const signed = bolt11.sign(encoded, nodePrivateKey);
	return signed.paymentRequest;
};
