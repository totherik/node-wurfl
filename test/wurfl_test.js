/*global describe:false, it:false, before:false, after:false*/
'use strict';

var should = require('should'),
	Wurfl = require('../index');


describe('wurfl', function () {

	var client = null,
		req = {
			headers: {
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1'
			},
			connection: {
				remoteAddress: '255.255.255.255'
			}
		};

	it('should create a WURFL client', function (next) {
		client = Wurfl.createClient({ apiKey: '%YourApiKey%' });
		should.exist(client);
		next();
	});


	it('should successfully initiate a request with no capabilities defined', function (next) {
		client.getCapabilities(req, function (err, capabilities) {
			should.not.exist(err);
			should.exist(capabilities);

			should.strictEqual(capabilities.isWirelessDevice, false);
			should.strictEqual(capabilities.isTablet, false);

			next();
		});
	});


	it('should successfully return the specified capability', function (next) {
		client.getCapabilities(req, ['is_wireless_device'], function (err, capabilities) {
			should.not.exist(err);
			should.exist(capabilities);

			should.not.exist(capabilities.isTablet);

			should.exist(capabilities.isWirelessDevice);
			should.strictEqual(capabilities.isWirelessDevice, false);

			next();
		});
	});


	it('should return an error when requesting an unauthorized capability', function (next) {
		client.getCapabilities(req, ['brand_name'], function (err, value) {
			should.exist(err);
			should.exist(err.details);
			should.not.exist(value);

			next();
		});
	});


});