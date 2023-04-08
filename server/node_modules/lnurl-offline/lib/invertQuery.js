module.exports = function(query, fromTo) {
	let inverted = JSON.parse(JSON.stringify(query));
	Object.entries(fromTo.query).forEach(([from, to], index) => {
		if (typeof inverted[from] !== 'undefined') {
			inverted[to] = inverted[from];
			delete inverted[from];
		}
	});
	const tag = (function() {
		for (let from in fromTo.tags) {
			let to = fromTo.tags[from];
			if (to === (inverted.tag || inverted.t) || from === (inverted.tag || inverted.t)) {
				return from;
			}
		}
	})();
	if (fromTo.params[tag]) {
		Object.entries(fromTo.params[tag]).forEach(([from, to], index) => {
			if (typeof inverted[from] !== 'undefined') {
				inverted[to] = inverted[from];
				delete inverted[from];
			}
		});
	}
	if (inverted.tag && typeof fromTo.tags[inverted.tag] !== 'undefined') {
		inverted.tag = fromTo.tags[inverted.tag];
	} else if (inverted.t && typeof fromTo.tags[inverted.t] !== 'undefined') {
		inverted.t = fromTo.tags[inverted.t];
	}
	return inverted;
};
