'use strict'

var Firebase = require('firebase')

var CONFIG   = require('./config')
var APP_NAME = CONFIG.appName
var BASE_URL = CONFIG.baseUrl

module.exports = new Firebase(BASE_URL)