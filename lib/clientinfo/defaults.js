/*globals exports:true*/
'use strict';

var util = require('util'),
	AbstractRule = require('./abstractRule');

function Defaults(next) {
	Defaults.super_.call(this, next);
}

util.inherits(Defaults, AbstractRule);

Defaults.Headers = ['x-device-user-agent',
					'x-original-user-agent',
					'x-operamini-phone-ua',
					'x-skyfire-phone',
					'x-bolt-phone-ua',
					'x-wap-profile',
					'profile' ];

Defaults.prototype._doExecute = function (req, info, next) {
	var source = req.headers,
		dest = info.headers || (info.headers = {});

	Defaults.Headers.forEach(function (header) {
		if (source.hasOwnProperty(header)) {
			dest[header] = source[header];
		}
	});

	next(null, info);
};



exports = module.exports = {
	createRule: function (next) {
		return new Defaults(next);
	}
};