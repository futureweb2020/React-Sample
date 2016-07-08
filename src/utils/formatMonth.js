'use strict'

var moment = require('moment')
var formatDate = require('./formatDate')

module.exports = function(value){
    value = moment(value).startOf('month')
    return formatDate(value, 'month')
}