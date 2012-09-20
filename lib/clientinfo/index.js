/*globals exports:true*/
'use strict';

var definitions = [ require('./defaults'),
					require('./forwardedFor'),
					require('./userAgent'),
					require('./accepts') ];

exports = module.exports = definitions.reduce(function (previous, current) {
	if (previous.createRule) {
		previous = previous.createRule(null);
	}
	return current.createRule(previous);
});