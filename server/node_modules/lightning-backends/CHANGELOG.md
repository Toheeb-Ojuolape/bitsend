# Changelog

* v1.5.1:
	* addInvoice: If supported, LN backend should set description_hash ("purpose_commit_hash")
	* Fix lnpay domain
	* dummy LN backend should return preimage as hex string
* v1.5.0:
	* All backends: payInvoice method now returns preimage if provided by LN backend
	* lndhub: more tolerant checks in getInvoiceStatus method
* v1.4.0:
	* Added form.js which does TLS check (lnd, c-lightning-sparko) and toggling visibility of backend form fields
	* New option for createForm method ("exclude")
* v1.3.0:
	* Added getBalance method to all LN backends
* v1.2.0:
	* Added C-Lightning backend - JSON-RPC over unix sock or HTTP-RPC made available by Sparko plugin
* v1.1.1:
	* Added missing form inputs
	* Fix mutation of check method error messages on backend prototypes
* v1.1.0:
	* Form-related helpers and improvements
* v1.0.2:
	* Support backend = { path: '/full/path/to/backend.js' }
* v1.0.1:
	* Minor fixes related to formGroups
* v1.0.0:
	* Initial release
