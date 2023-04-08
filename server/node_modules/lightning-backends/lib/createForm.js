const assert = require('assert');
const checkBackend = require('./checkBackend');
const Form = require('@bleskomat/form');
const getBackends = require('./getBackends');
const { ValidationError } = Form;

const createForm = function(formOptions, options) {
	const groups = prepareGroups(options);
	formOptions = Object.assign({
		groups,
		validate: function(data) {
			const config = valuesToBackendConfig(data);
			const { backend } = data;
			return checkBackend(backend, config).then(result => {
				const { ok, message } = result;
				assert.ok(result.ok, new ValidationError(`Failed test of Lightning configurations: "${message}"`));
			});
		},
		process: function(values) {
			const { backend } = values;
			const config = valuesToBackendConfig(values);
			values.lightning = { backend, config };
			return values;
		},
	}, formOptions || {});
	return new Form(formOptions);
};

const prepareGroups = function(options) {
	options = Object.assign({
		exclude: ['dummy'],
		tlsCheckUri: '',
	}, options || {});
	assert.ok(options.exclude instanceof Array, 'Invalid option ("exclude"): Array expected');
	assert.strictEqual(typeof options.tlsCheckUri, 'string', 'Invalid option ("tlsCheckUri"): String expected');
	const Backends = getBackends().filter(Backend => {
		return !options.exclude.includes(Backend.name);
	});
	return [{
		name: 'backend',
		instructions: 'To test new Lightning credentials, a payment will be attempted using an invoice with a randomly generated node pubkey in the amount of 1 satoshi.',
		inputs: [
			{
				name: 'backend',
				label: 'Lightning Backend Type',
				type: 'select',
				options: (function() {
					return [{ key: '', label: '' }].concat(Backends.map(Backend => {
						const { name } = Backend;
						const { label } = Backend.form;
						return {
							key: name,
							label: label || name,
						};
					}));
				})(),
				default: '',
				required: true,
				validate: function(value) {
					assert.ok(Backends.find(Backend => Backend.name === value), new ValidationError(`Unknown backend: "${value}"`));
				},
			},
			{
				name: 'tlsCheckUri',
				type: 'hidden',
				default: options.tlsCheckUri,
			},
		],
	}].concat(Backends.map(Backend => {
		const { name } = Backend;
		const inputs = Backend.form.inputs.map(input => {
			return Object.assign({}, input, {
				name: `${name}[${input.name}]`,
				required: function(data) {
					// Inputs not required if backend not selected.
					if (typeof data !== 'undefined' && data.backend !== name) {
						return false;
					}
					if (typeof input.required === 'function') {
						return input.required(data || {});
					}
					return input.required === true;
				},
			});
		});
		return { inputs, name };
	}));
};

const valuesToBackendConfig = function(values) {
	const { backend } = values;
	let config = {};
	Object.entries(values).forEach(([key, value], index) => {
		const match = key.match(/([^\[]+)\[([^\[\]]+)\]/i);
		if (!match || !match[1] || !match[2]) return null;
		if (match[1] !== backend) return null;
		config[match[2]] = value;
	});
	switch (backend) {
		case 'lnd':
			if (typeof config.fingerprint !== 'undefined') {
				delete config.fingerprint;
			}
			if (typeof config.fingerprint256 !== 'undefined') {
				delete config.fingerprint256;
			}
			config.cert = config.cert && { data: config.cert } || null;
			config.macaroon = config.macaroon && { data: config.macaroon } || null;
			break;
		case 'c-lightning-sparko':
			if (typeof config.fingerprint !== 'undefined') {
				delete config.fingerprint;
			}
			if (typeof config.fingerprint256 !== 'undefined') {
				delete config.fingerprint256;
			}
			break;
	}
	return config;
};

createForm.Form = Form;
createForm.ValidationError = ValidationError;
createForm.prepareGroups = prepareGroups;
createForm.valuesToBackendConfig = valuesToBackendConfig;
module.exports = createForm;
