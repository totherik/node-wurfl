/*global describe:false, it:false, before:false, after:false*/
'use strict';

var should = require('should'),
	pool = require('../lib/serverpool').getPool(),
	utils = require('../lib/utils');


describe('serverpool', function () {

	var servers = pool.servers;

	before(function () {
		var i = 0,
			server = null,
			template = {
				name: 'cloud',
				host: 'api.wurflcloud.com',
				port: 80
			},
			weights = [10, 10, 10, 10, 500];

		for (; i < 5; i++) {
			server = utils.clone(template);
			server.host = i + server.host;
			server.weight = weights[i];
			pool.addServer(server);
		}
	});


	after(function () {
		pool.clearServers();
		servers.forEach(function (server) {
			pool.addServer(server);
		});
	});


	it('should get a heavier weighted server more often', function (next) {
		var server = null,
			count = 0;

		for (var i = 0; i < 10; i++) {
			server = pool.next();
			if (server.host === '4api.wurflcloud.com') {
				count++;
			}
		}

		count.should.be.above(6);
		next();
	});

});