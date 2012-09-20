/*globals exports:true*/
'use strict';

var util = require('util'),
	AbstractRule = require('./abstractRule');

function Accepts(next) {
	Accepts.super_.call(this, next);
}

util.inherits(Accepts, AbstractRule);


Accepts.prototype._doExecute = function (req, info, next) {
	var source = req.headers,
		dest = info.headers || (info.headers = {});

	if (source.hasOwnProperty('accept')) {
		dest['X-Accept'] = source['accept'];
	}

	next(null, info);
};



exports = module.exports = {
	createRule: function (next) {
		return new Accepts(next);
	}
};