'use strict'

var F  = require('functionally')
var by = require('./by')

var findItemIndexBy = F.curry(function(fn, arr, value){
    return F.findIndex(fn(value), arr)
})

module.exports = {
    name: findItemIndexBy(by.name),
    id  : findItemIndexBy(by.id)
}