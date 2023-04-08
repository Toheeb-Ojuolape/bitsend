const ValidationError = function(message) {
	if (!Error.captureStackTrace) {
		this.stack = (new Error()).stack;
	} else {
		Error.captureStackTrace(this, this.constructor);
	}
	this.message = message;
};

ValidationError.prototype = new Error;
ValidationError.name = 'ValidationError';
ValidationError.constructor = ValidationError;

module.exports = ValidationError;
