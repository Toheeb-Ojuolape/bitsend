(function() {

	var formGroupBackendEl = document.querySelector('.form-group.form-group--backend');
	var formEl = formGroupBackendEl && formGroupBackendEl.parentElement && formGroupBackendEl.parentElement.parentElement;
	if (!formEl) return;

	var fields = {
		'backend': formEl.querySelector('select[name="backend"]'),
		'tlsCheckUri': formEl.querySelector('input[name="tlsCheckUri"]'),
		'c-lightning-sparko[baseUrl]': formEl.querySelector('input[name="c-lightning-sparko[baseUrl]"]'),
		'c-lightning-sparko[cert]': formEl.querySelector('textarea[name="c-lightning-sparko[cert]"]'),
		'c-lightning-sparko[fingerprint]': formEl.querySelector('input[name="c-lightning-sparko[fingerprint]"]'),
		'c-lightning-sparko[fingerprint256]': formEl.querySelector('input[name="c-lightning-sparko[fingerprint256]"]'),
		'lnd[baseUrl]': formEl.querySelector('input[name="lnd[baseUrl]"]'),
		'lnd[cert]': formEl.querySelector('textarea[name="lnd[cert]"]'),
		'lnd[fingerprint]': formEl.querySelector('input[name="lnd[fingerprint]"]'),
		'lnd[fingerprint256]': formEl.querySelector('input[name="lnd[fingerprint256]"]'),
	};

	if (!fields['backend']) return;

	var formErrors = formEl.querySelector('.form-errors');

	var getSelectedBackend = function() {
		return fields['backend'].value;
	};

	var backends = (function() {
		var values = [];
		fields['backend'].querySelectorAll('option').forEach(option => {
			if (option.value) {
				values.push(option.value);
			}
		});
		return values;
	})();

	var showGroup = function(name) {
		backends.forEach(backend => {
			var group = formEl.querySelector('.form-group--' + backend);
			group && (group.style.display = backend === name ? 'block' : 'none');
		});
	};

	var showSelectedBackendGroup = function() {
		showGroup(getSelectedBackend());
	};

	fields['backend'].addEventListener('change', showSelectedBackendGroup);
	showSelectedBackendGroup();

	var tlsCheckUri = fields['tlsCheckUri'] && fields['tlsCheckUri'].value || null;
	if (tlsCheckUri) {

		fields['backend'].addEventListener('change', clearTlsCheckError);

		var toggleCertFieldsVisibility = function(backend, toggle) {
			var certRow = formEl.querySelector('.form-row--' + backend + '-cert');
			var fingerprintRow = formEl.querySelector('.form-row--' + backend + '-fingerprint');
			var fingerprint256Row = formEl.querySelector('.form-row--' + backend + '-fingerprint256');
			certRow && (certRow.style.display = toggle ? 'inline-block' : 'none');
			fingerprintRow && (fingerprintRow.style.display = toggle ? 'inline-block' : 'none');
			fingerprint256Row && (fingerprint256Row.style.display = toggle ? 'inline-block' : 'none');
		};

		var showTlsCheckError = function(hostname, errorMessage) {
			var message = 'Failed TLS check for "' + hostname + '": ' + errorMessage;
			var newError = document.createElement('p');
			newError.textContent = message;
			newError.classList.add('tls-check');
			formErrors && formErrors.appendChild(newError);
		};

		var clearTlsCheckError = function() {
			if (formErrors) {
				var tlsError = formErrors.querySelector('.tls-check');
				tlsError && tlsError.parentNode.removeChild(tlsError);
			}
		};

		var doTlsCheck = function(hostname) {
			var backend = getSelectedBackend();
			var uri = tlsCheckUri + '?hostname=' + encodeURIComponent(hostname);
			return fetch(uri, { method: 'GET' }).then(function(response) {
				return response.json().then(function(data) {
					if (data.error) {
						showTlsCheckError(hostname, data.error);
						clearCertFields();
					} else {
						setCertFeids(backend, data.pem, data.fingerprint, data.fingerprint256);
					}
				});
			}).catch(function() {
				showTlsCheckError(hostname, 'An unexpected error occurred');
				clearCertFields();
			});
		};

		var clearCertFields = function(backend) {
			setCertFeids(backend, '', '', '');
		};

		var setCertFeids = function(backend, cert, fingerprint, fingerprint256) {
			fields[backend + '[cert]'] && (fields[backend + '[cert]'].value = cert);
			fields[backend + '[fingerprint]'] && (fields[backend + '[fingerprint]'].value = fingerprint);
			fields[backend + '[fingerprint256]'] && (fields[backend + '[fingerprint256]'].value = fingerprint256);
		};

		var parseBaseUrl = function(baseUrl) {
			var parts = baseUrl.split('://');
			var protocol = parts[0];
			var hostname = parts[1].split('/')[0];
			return {
				protocol: protocol,
				hostname: hostname,
			};
		};

		['c-lightning-sparko', 'lnd'].forEach(function(backend) {
			fields[backend + '[baseUrl]'] && fields[backend + '[baseUrl]'].addEventListener('change', function(event) {
				clearTlsCheckError();
				var baseUrl = fields[backend + '[baseUrl]'].value;
				if (baseUrl) {
					var parsed = parseBaseUrl(baseUrl);
					if (parsed.protocol === 'https' && parsed.hostname) {
						toggleCertFieldsVisibility(backend, true);
						return doTlsCheck(parsed.hostname);
					}
				}
				toggleCertFieldsVisibility(backend, false);
				clearCertFields();
			});
			if (getSelectedBackend() === backend) {
				var baseUrl = fields[backend + '[baseUrl]'].value;
				var parsed = parseBaseUrl(baseUrl);
				if (parsed.protocol === 'https' && parsed.hostname) {
					toggleCertFieldsVisibility(backend, true);
					if (!fields[backend + '[cert]'].value) {
						doTlsCheck();
					}
				}
			}
		});
	}

})();
