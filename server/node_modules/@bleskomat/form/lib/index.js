const _ = require('underscore');
const ValidationError = require('./ValidationError');

const Form = function(options) {
	this.options = _.defaults(options || {}, {
		id: 'form',
		action: '',
		groups: [],
		help: '',
		helpHtml: '',
		instructions: '',
		instructionsHtml: '',
		method: 'post',
		process: null,
		// buttons: [
		// 	{ label: 'Cancel', href: '/', className: 'cancel' },
		// 	{ label: 'Submit', className: 'submit' },
		// ],
		submit: 'Submit',
		validate: null,
	});
	if (this.options.process) {
		if (!_.isFunction(this.options.process)) {
			throw new Error('Invalid option ("process"): Function expected');
		}
	}
	if (this.options.validate) {
		if (!_.isFunction(this.options.validate)) {
			throw new Error('Invalid option ("validate"): Function expected');
		}
	}
	this.inputs = this.prepareInputs(this.options.groups);
};

Form.ValidationError = ValidationError;
Form.handlebars = require('./handlebars');

Form.prototype.prepareInputs = function(groups) {
	groups = groups || [];
	return Array.prototype.concat.apply([], _.pluck(groups, 'inputs'));
};

Form.prototype.validate = function(data) {
	return Promise.all(this.inputs.map(input => {
		try {
			const { name } = input;
			const label = input.label || name;
			let value = data[name];
			if (!value) {
				let required = false;
				if (_.isFunction(input.required)) {
					required = input.required(data) === true;
				} else {
					required = input.required === true;
				}
				if (required) {
					throw new ValidationError(`"${label}" is required`);
				}
			} else {
				switch (input.type) {
					case 'select':
						input.options = _.result(input, 'options');
						if (!_.findWhere(input.options, { key: value })) {
							throw new ValidationError(`Unknown option selected for "${label}"`);
						}
						break;
				}
			}
			if (input.validate) {
				// Prevent mutation of data object by deep-cloning before passing into validate method.
				const promise = input.validate(value, this.deepClone(data));
				if (promise instanceof Promise) {
					return promise;
				}
			}
		} catch (error) {
			return Promise.reject(error);
		}
		return Promise.resolve();
	})).then(() => {
		if (this.options.validate) {
			return this.options.validate(data);
		}
	}).then(() => {
		return this.process(data);
	});
};

Form.prototype.deepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

Form.prototype.process = function(data) {
	data = data || {};
	let values = _.chain(this.inputs).map(input => {
		const { name } = input;
		let value = data[name];
		if (!value && !_.isUndefined(input.default)) {
			value = input.default;
		}
		if (input.process) {
			value = input.process(value);
		}
		switch (input.type) {
			case 'checkbox':
				value = !!value;
				break;
		}
		return [name, value];
	}).object().value();
	if (this.options.process) {
		values = this.options.process(values);
	}
	return values;
};

const normalizeClassName = Form.normalizeClassName = function(className) {
	return className.replace(/[ _\[]/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
};

// Prepare the form for an HTML template/view.
Form.prototype.serialize = function(options) {
	options = _.defaults(options || {}, {
		extend: {},
		values: {},
	});
	const groups = _.map(this.options.groups, function(group, index) {
		group = _.clone(group);
		group.name = group.name || `group-${index}`;
		group.className = normalizeClassName(group.name);
		group.inputs = _.map(group.inputs, function(input) {
			input = _.clone(input);
			const value = options.values[input.name];
			if (!_.isUndefined(value) && !_.isNull(value)) {
				input.value = value;
			} else if (!_.isUndefined(input.default)) {
				input.value = input.default;
			}
			switch (input.type) {
				case 'checkbox':
					input.checked = !!input.value;
					break;
				case 'select':
					input.options = _.result(input, 'options');
					input.options = _.map(input.options, function(option) {
						option.selected = option.key === input.value;
						return option;
					});
					break;
			}
			if (!input.id) {
				input.id = ['form', group.name, input.name].join('-');
			}
			input.className = normalizeClassName(input.name);
			input.visible = input.visible !== false;
			['description', 'descriptionHtml'].forEach(key => {
				if (_.isFunction(input[key])) {
					input[key] = input[key](options.values);
				}
			});
			return input;
		});
		return group;
	});
	let serialized = _.extend({}, _.omit(this.options, 'groups'), options.extend, { groups });
	serialized.hasRequiredFields = _.some(this.inputs, input => {
		return input.required === true;
	});
	return serialized;
};

module.exports = Form;

