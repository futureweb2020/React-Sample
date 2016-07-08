'use strict'

var moment = require('moment')

module.exports = {

    fromNow: function(moment) {
        return moment.fromNow()
    },

    long: {
        date: function(moment){
            return moment.format('LLL')
        },
        month: function(moment){
            return moment.format('MMM, YYYY')
        },
        day: function(moment){
            return moment.format('MMM DD, YYYY')
        }
    },

    iso: {
        date: function(moment){
            return moment.format('YYYY-MM-DD HH:mm')
        },
        month: function(moment){
            return moment.format('YYYY-MM')
        },
        day: function(moment){
            return moment.format('YYYY-MM-DD')
        }
    }
}