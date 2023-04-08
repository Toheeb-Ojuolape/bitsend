const assert = require('assert');

class LightningBackend {

	constructor(name, options, classOptions) {
		assert.ok(name, 'Missing required argument: "name"');
		this.name = name;
		classOptions = classOptions || {};
		this.checkRequiredPrototypeMethods();
		const defaultOptions = Object.assign({}, this.defaultOptions || {}, classOptions.defaultOptions || {});
		options = Object.assign(defaultOptions, options || {});
		const requiredOptions = this.requiredOptions.concat(classOptions.requiredOptions);
		this.checkRequiredOptions(options, requiredOptions);
		this.checkOptions && this.checkOptions(options);
		this.options = options;
		this.prepareCheckMethodErrorRegEx();
	}

	checkRequiredOptions(options, requiredOptions) {
		requiredOptions = requiredOptions || [];
		const { name } = this;
		requiredOptions.forEach(optionName => {
			assert.ok(options[optionName], `LightningBackend [${name}] missing required option: "${optionName}"`);
		});
	}

	checkRequiredPrototypeMethods() {
		const { name } = this;
		['getNodeUri', 'openChannel', 'payInvoice', 'addInvoice'].forEach(requiredMethod => {
			assert.ok(this[requiredMethod] && typeof this[requiredMethod] === 'function', `LightningBackend [${name}] missing required method: "${requiredMethod}"`);
		});
	}

	prepareCheckMethodErrorRegEx() {
		this.checkMethodErrorRegEx = {};
		Object.keys(this.checkMethodErrorMessages).forEach(method => {
			this.checkMethodErrorRegEx[method] = {};
			Object.keys(this.checkMethodErrorMessages[method]).forEach(key => {
				const messages = this.checkMethodErrorMessages[method][key];
				assert.ok(messages instanceof Array, `Invalid checkMethodErrorMessages[${method}][${key}]: Array expected`);
				if (messages && messages.length > 0) {
					this.checkMethodErrorRegEx[method][key] = new RegExp(messages.join('|'), 'i');
				}
			});
		});
	}

	getBalance() {
		return Promise.reject(new Error('Not implemented'));
	}
};

LightningBackend.prototype.checkMethodErrorMessages = {
	payInvoice: {
		ok: [],
		notOk: [],
	},
};

LightningBackend.prototype.defaultOptions = {};
LightningBackend.prototype.requiredOptions = [];

LightningBackend.form = {
	label: '',
	inputs: [],
};

module.exports = LightningBackend;
