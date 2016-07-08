'use strict'

var moment = require('moment')
var formats = require('./dateFormats')
var DataManager = require('../data/DataManager')

module.exports = function(value, what){
    value = moment(value)

    var format = formats[DataManager.get('dateFormat') || 'fromNow']

    format = format[what] || format.date || format

    return format(value)
}