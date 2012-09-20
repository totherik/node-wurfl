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

	_aliasCache: {},

	_getAlias: function (key) {
		// Convert from '_' delimited to camel case
		return this._aliasCache[key] || (this._aliasCache[key] = key.replace(/_([a-z])/g, function (g) {
			return g[1].toUpperCase();
		}));
	},

	getCapabilities: function (req, capabilities, callback) {
		if (typeof capabilities === 'function') {
			callback = capabilities;
			capabilities = [];
		}

		rules.execute(req, function (err, info) {
			if (err) { return callback(err); }

			capabilities = capabilities.concat(this._defaultCapabilities);
			function onHttpResponse(err, response) {
				if (err) { return callback(err); }

				var capabilities = response.capabilities,
					result = {};

				Object.keys(capabilities).forEach(function (key) {
					var newKey = this._getAlias(key);
					result[newKey] = capabilities[key];
				}.bind(this));

				callback(null, Object.freeze(result));
			}

			this._client.get(info, capabilities, onHttpResponse.bind(this));

		}.bind(this));
	}

};

exports = module.exports = {
	createClient: function (config) {
		return new WurflClient(config);
	}
};