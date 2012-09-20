/*globals exports:true*/
'use strict';

function AbstractRule(next) {
	this._next = next;
}

AbstractRule.prototype = {

	execute: function (req, data, callback) {
		var next = this._next;

		if (typeof data === 'function') {
			callback = data;
			data = {};
		}

		this._doExecute(req, data, function (err, data) {
			if (err) { return callback(err); }
			if (next) { return next.execute(req, data, callback); }
			callback(null, data);
		});
	},

	_doExecute: function (req, data, next) {
		throw new Error('Not implemented');
	}

};

exports = module.exports = AbstractRule;