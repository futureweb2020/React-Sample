'use strict'

var F = require('functionally')

var byProperty = F.curry(function(name, value){
    return function(item){
        return item[name] == value
    }
})

module.exports = {
    name: byProperty('name'),
    id  : byProperty('id')
}