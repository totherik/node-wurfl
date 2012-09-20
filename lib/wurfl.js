/*global exports:true*/
'use strict';

var HttpClient = require('./httpclient'),
	rules = require('./clientinfo');


function WurflClient(config) {
	config = config || {};
	this._client = new HttpClient(config.apiKey);
	this._defaultCapabilities = config.defaultCapabilities || [];
}

WurflClient.prototype = {

	getCapabilities: function (req, capabilities, callback) {
		if (typeof capabilities === 'function') {
			callback = capabilities;
			capabilities = [];
		}

		rules.execute(req, function (err, info) {
			capabilities = capabilities.concat(this._defaultCapabilities);
			this._client.get(info, capabilities, callback);
		}.bind(this));
	}

};

exports = module.exports = {
	createClient: function (config) {
		return new WurflClient(config);
	}
};