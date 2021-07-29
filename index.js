'use strict';
const express = require('express');
const kraken = require('kraken-js');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc");

let options, app;

options = {
  onconfig: function (config, next) {
    next(null, config);
  }
};
const options_swagger = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:8000",
			},
		],
	},
	apis: ["./app/controllers/api/v1/*.js"],
};

const specs = swaggerJsDoc(options_swagger);
app = module.exports = express();

app.use(express.static(__dirname + '/public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

global.db = require('./app/models/index');
global.log = require('./app/lib/logger');
global.appRoot = path.resolve(__dirname);

global.kraken = app.kraken;
app.use(kraken(options));
app.on('start', function () {
  global.kraken = app.kraken;
  global.log.info('Application ready to serve requests.');
  global.log.info('Environment: %s', app.kraken.get('env:env'));
});
