'use strict'

var moment = require('moment')
var formats = require('./dateFormats')
var DataManager = require('../data/DataManager')

module.exports = function(value){
    value = moment(value)

    var formatKey = DataManager.get('dateFormat') || 'fromNow'

    if (formatKey == 'fromNow'){
        formatKey = 'iso'
    }

    var format = formats[formatKey]

    format = format.day || format

    return format(value)
}