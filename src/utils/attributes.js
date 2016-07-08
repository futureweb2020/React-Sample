'use strict'

var formatDate   = require('./formatDate')
var formatNumber = require('./formatNumber')

module.exports =[
    {
        name: 'text',
        label: 'Meal',
        width: '100%'
    },
    {
        name : 'amount',
        label: 'Calories',
        editor: require('../../react-components/NumberField'),
        render: function(value){
            return formatNumber(value, DataManager.get('groupSeparator'))
        }
    },
    {
        name: 'date',
        label: 'Date',
        render: function(date){
            return formatDate(date)
        },
        editor: require('../../react-components/DateTimeField')
    }
]