'use strict'

var F  = require('functionally')
var by = require('./by')

var findItemBy = F.curry(function(fn, arr, value){
    return F.find(fn(value), arr)
})

module.exports = {
    name: findItemBy(by.name),
    id  : findItemBy(by.id)
}