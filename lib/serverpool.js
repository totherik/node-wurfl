/*global exports:true*/
'use strict';

var utils = require('./utils');


var SERVERS = [
	{
		name: 'cloud01',
		host: 'api.wurflcloud.com',
		port: 80,
		weight:80
	}
];

function ServerPool() {
	this._servers = SERVERS;
	this._currentServer = this._servers[0];
}

ServerPool.prototype = {

	next: function () {
		var server = this._getServerByWeight();
		return {
			host: server.host,
			port: server.port
		};
	},

	addServer: function (def) {
		this._servers.push(def);
	},

	get servers() {
		return this._servers.concat();
	},

	clearServers: function () {
		this._servers = [];
		this._currentServer = null;
	},

	_getServerByWeight: function () {
		if (this._servers.length === 1 && this._currentServer) {
			return this._currentServer;
		}

		var totalWeight = 0,
			cumulativeWeight = 0,
			rand = 0,
			selected = null;

		this._servers.forEach(function (server) {
			totalWeight += server.weight;
		});

		rand = utils.randomInRange(0, totalWeight);
		this._servers.some(function (server) {
			selected = server;
			return rand < (cumulativeWeight += server.weight);
		});

		return this._currentServer = selected;
	}

};

var INSTANCE = null;
exports = module.exports = {
	getPool: function () {
		if (!INSTANCE) {
			INSTANCE = new ServerPool();
		}
		return INSTANCE;
	}
};