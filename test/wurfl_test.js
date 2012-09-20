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
		client = Wurfl.createClient({ apiKey: 'API KEY GOES HERE' });
		should.exist(client);
		next();
	});


	it('should successfully initiate a request with no capabilities defined', function (next) {
		client.getCapabilities(req, function (err, value) {
			should.not.exist(err);
			should.exist(value);
			should.exist(value.capabilities);

			should.strictEqual(value.capabilities.is_wireless_device, false);
			should.strictEqual(value.capabilities.is_tablet, false);

			next();
		});
	});


	it('should successfully return the specified capability', function (next) {
		client.getCapabilities(req, ['is_wireless_device'], function (err, value) {
			should.not.exist(err);
			should.exist(value);
			should.exist(value.capabilities);

			should.not.exist(value.capabilities.is_tablet);

			should.exist(value.capabilities.is_wireless_device);
			should.strictEqual(value.capabilities.is_wireless_device, false);

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