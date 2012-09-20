/*global exports:true*/
'use strict';

function clone(src) {
	return mixin({}, src);
}

function mixin(dest, src) {
	Array.prototype.slice.call(arguments, 1).forEach(function mergeObject(src) {

		Object.keys(src).forEach(function copyProperty(prop) {
			// Get the descriptor and value
			var descriptor = Object.getOwnPropertyDescriptor(src, prop),
				value = descriptor.value;

			// If dest has the same property and the value is a proper object,
			// recurse and merge the two.
			if (dest.hasOwnProperty(prop) && typeof value === 'object' && !Array.isArray(value)) {
				mixin(dest[prop], value);
			} else {
				Object.defineProperty(dest, prop, descriptor);
			}
		});

	});

	return dest;
}

function randomInRange(min, max) {
	return Math.floor(min + (Math.random() * (max - min)));
}

exports = module.exports = {
	clone: clone,
	mixin: mixin,
	randomInRange: randomInRange
};