/*globals exports:true*/
'use strict';

var util = require('util'),
	AbstractRule = require('./abstractRule');

function XFF(next) {
	XFF.super_.call(this, next);
}

util.inherits(XFF, AbstractRule);


XFF.prototype._doExecute = function (req, info, next) {
	var ff = [String(req.connection.remoteAddress)],
		source = req.headers,
		dest = info.headers || (info.headers = {});

	if (source.hasOwnProperty('x-forwarded-for')) {
		ff.push(source('x-forwarded-for'));
	}

	dest['X-Forwarded-For'] = ff.join(',');
	next(null, info);
};



exports = module.exports = {
	createRule: function (next) {
		return new XFF(next);
	}
};