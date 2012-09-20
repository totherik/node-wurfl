/*global exports:true*/
'use strict';

var util = require('util'),
	http = require('http'),
	zlib = require('zlib'),
	utils = require('./utils'),
	serverPool = require('./serverpool').getPool();


var ERROR_CONFIG       = 1,  // Configuration error
	ERROR_NO_SERVER    = 2,  // Unable to contact server or Invalid server address
	ERROR_TIMEOUT      = 4,  // Timed out while contacting server
	ERROR_BAD_RESPONSE = 8,  // Unable to parse response
	ERROR_AUTH         = 16, // API Authentication failed
	ERROR_KEY_DISABLED = 32; //API Key is disabled or revoked


function Client(apiKey) {
	this._credentials = Client.parseKey(apiKey);
}

Client.DEFAULT_OPTIONS = {
	method: 'GET',
	headers: {
		'Accept': '*/*',
		'Accept-Encoding': 'gzip',
		'Connection': 'Close'
	}
};

Client.VERSION = '1.0.2';
Client.API_PATH = '/v1/json/';
Client.API_SEARCH_PATH = Client.API_PATH + 'search:(%s)';

Client.parseKey = function (apiKey) {
	if (!apiKey || typeof apiKey !== 'string') {
		throw new TypeError('Invalid or missing API Key. To sign up for a key, visit http://www.scientiamobile.com/cloud');
	}

	var pair = apiKey.split(':'),
		username = pair[0],
		password = pair[1];

	if (!(username && username.length === 6) && !(password && password.length === 32)) {
		throw new TypeError('Invalid or missing API Key. To sign up for a key, visit http://www.scientiamobile.com/cloud');
	}

	return {
		username: username,
		password: password,
		encoded: new Buffer(username + ':' + password).toString('base64')
	};
};

Client.prototype = {

	get: function (clientInfo, capabilities, callback) {
		var creds = this._credentials,
			path, options;

		path = Client.API_PATH;
		if (capabilities && capabilities.length) {
			path = util.format(Client.API_SEARCH_PATH, capabilities.join(','));
		}

		options = utils.mixin(
			{
				path: path,
				headers: {
					'Authorization': 'Basic ' + creds.encoded,
					'X-Cloud-Client': 'WurflCloudClient/NodeJS_' + Client.VERSION
				}
			},
			clientInfo,
			serverPool.next(),
			Client.DEFAULT_OPTIONS
		);

		this._doGet(options, callback);
	},

	_doGet: function (options, callback) {

		function responseHandler(res) {
			var data = [];

			res.on('data', function onData(chunk) {
				if (!Buffer.isBuffer(chunk)) {
					chunk = new Buffer(chunk, 'utf8');
				}
				data.push(chunk);
			});

			res.on('end', function onEnd() {

				this._parseResponse(res, Buffer.concat(data), function (err, raw) {
					// Parsing error
					if (err) { return callback(err); }

					// HTTP Error
					if (res.statusCode > 400 ) {
						err = new Error('Error reading from WURFL');
						err.code = res.statusCode;
						err.body = raw;
						return callback(err);
					}


					var body = this._parseJSON(raw),
						errors, errorNames;

					// Parser error
					if (!~body) {
						err = new Error('Could not parse JSON response');
						err.code = ERROR_BAD_RESPONSE;
						return callback(err);
					}

					errors = body.errors;
					errorNames = Object.keys(errors);

					// Application error
					if (errorNames && errorNames.length) {
						err = new Error('Unable to process request');
						err.details = [];
						errorNames.forEach(function (name) {
							err.details.push({
								message: errors[name],
								detail: name
							});
						});
						return callback(err);
					}

					// Success
					callback(null, body);

				}.bind(this));

			}.bind(this));
		}

		var request = http.get(options, responseHandler.bind(this));
		request.on('error', callback);
		request.end();

	},

	_parseJSON: function (raw) {
		try {
			return JSON.parse(raw);
		} catch (e) {
			return -1;
		}
	},

	_parseResponse: function (res, buffer, callback) {
		var encoding = res.headers['content-encoding'];
		if (encoding === 'gzip' || encoding === 'deflate') {
			return zlib.unzip(buffer, function (err, str) {
				callback(err, str);
			});
		}
		callback(null, buffer.toString('utf8'));
	}
};

exports = module.exports = Client;