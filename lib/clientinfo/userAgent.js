/*globals exports:true*/
'use strict';

var util = require('util'),
	AbstractRule = require('./abstractRule');

function UserAgent(next) {
	UserAgent.super_.call(this, next);
}

util.inherits(UserAgent, AbstractRule);


UserAgent.prototype._doExecute = function (req, info, next) {
	var source = req.headers,
		userAgent = source['x-operamini-phone-ua'] || source['user-agent'],
		dest = info.headers || (info.headers = {});

	if (userAgent) {
		dest['User-Agent'] = userAgent.substring(0, 255);
	}

	next(null, info);
};



exports = module.exports = {
	createRule: function (next) {
		return new UserAgent(next);
	}
};