const { handlebars } = require('express-handlebars').create();

module.exports = {
	switch: function(value, options) {
		this._switch_value_ = value;
		this._switch_break_ = false;
		const html = options.fn(this);
		delete this._switch_break_;
		delete this._switch_value_;
		return html;
	},
	case: function(value, options) {
		const args = Array.prototype.slice.call(arguments);
		options	= args.pop();
		const caseValues = args;
		if (this._switch_break_ || caseValues.indexOf(this._switch_value_) === -1) {
			return '';
		}
		if (options.hash.break === true) {
			this._switch_break_ = true;
		}
		return options.fn(this);
	},
	default: function(options) {
		if (!this._switch_break_) {
			return options.fn(this);
		}
	},
	breaklines: function(text, options) {
		text = handlebars.Utils.escapeExpression(text);
		text = text.replace(/(\r\n|\n|\r)/g, '&#10;');
		return new handlebars.SafeString(text);
	},
};
