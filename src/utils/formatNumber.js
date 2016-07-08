'use strict'

var groupSeparator = '.'

function getGroups(value){
    var res   = []
    var group = []

    while(value){
        if (group.length == 3){
            res.unshift(group.join(''))
            group = []
        }
        group.unshift(value % 10)
        value = Math.floor(value / 10)
    }

    res.unshift(group.join(''))

    return res
}

module.exports = function(value, separator){
    if (isNaN(parseInt(value))){
        return value
    }

    var result = getGroups(value).join(separator || groupSeparator)

    return result
}