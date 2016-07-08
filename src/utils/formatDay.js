'use strict'

var moment = require('moment')
var formatDate = require('./formatDate')

module.exports = function(value){
    value = moment(value).startOf('day')
    return formatDate(value, 'day')
}