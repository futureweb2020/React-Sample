'use strict'

/**
 * Manages the data of the app (found in AppData)
 *
 */

var Emitter = require('zemitter')
var hasown  = require('hasown')
var copy    = require('copy-utils').copy
var F       = require('functionally')
var uuid    = require('uuid').v4
var moment = require('moment')

var AppData   = require('./AppData')


var findBy      = require('../utils/findBy')
var findIndexBy = require('../utils/findIndexBy')

var findIndex    = findIndexBy.id(AppData.meals)
var findProperty = findBy.name(AppData.configs)

var DataStore = require('./DataStore')
var StateManager = require('../state/StateManager')
var API = require('../api')

function isValid(filter){
    return !!(filter.value && filter.value.from || filter.value.to)
}

var test = F.curry(function(meal, filter){
    var date = moment(meal.date)

    if (filter.type == 'date'){
        var start = filter.value.from? moment(filter.value.from).startOf('day'): 0
        var end = filter.value.to? moment(filter.value.to).endOf('day'): Infinity

        return !date.isBefore(start) && !date.isAfter(end)
    }

    var mealHour = date.get('hour')
    var mealMinute = date.get('minute')

    var from = filter.value.from || 0
    var to = filter.value.to || Infinity

    var isBefore = (mealHour < from.hour) || (mealHour == from.hour && mealMinute < from.minute)
    var isAfter = (mealHour > to.hour) || (mealHour == to.hour && mealMinute > to.minute)

    return !isBefore && !isAfter
})

var applyFilters = F.curry(function(filters, meal){

    var testMeal = test(meal)

    return filters.reduce(function(prev, filter){
        return prev && testMeal(filter)
    }, true)

})

var DataManager = Emitter({

    get meals(){
        var sort  = DataManager.get('sortDir') == 'desc'? 1: -1
        var meals = AppData.meals.sort(function(a, b){
            return sort * (b.date - a.date)
        })

        var filters = StateManager.get('filters').filter(isValid)

        return meals.filter(applyFilters(filters))
    },

    get configs(){
        return AppData.configs
    },

    set meals(meals){

        AppData.meals.length = 0

        meals && AppData.meals.push.apply(AppData.meals, meals)

        DataManager.refresh()
    },

    clear: function() {
        var arr = AppData.meals

        if (arr.length){
            arr.length = 0

            DataManager.refresh()

            return true
        }
    },

    add: function(meal, cb){
        meal.date = +meal.date
        DataStore.addMeal(meal, cb)

        return meal
    },

    remove: function(idOrMeal) {
        var id = typeof idOrMeal == 'object'? idOrMeal.id: idOrMeal

        return DataManager._removeAt(findIndex(id))
    },

    _removeAt: function(index) {
        var arr = AppData.meals

        if (index >= 0 && index < arr.length){
            arr.splice(index, 1)
            DataManager.refresh()

            return true
        }
    },

    _updateAt: function(index, values) {
        var arr = AppData.meals

        if (index >= 0 && index < arr.length){
            copy(values, arr[index])
            DataManager.refresh()

            return true
        }
    },

    update: function(idOrMeal, values) {
        var id = typeof idOrMeal == 'object'? idOrMeal.id: idOrMeal

        if (typeof idOrMeal == 'object' && arguments.length == 1){
            values = idOrMeal
        }

        return DataManager._updateAt(findIndex(id), values)
    },

    set: function(name, value) {
        var obj = name

        if (typeof name != 'object'){
            obj = {}
            obj[name] = value
        }

        return DataManager.setMany(obj)
    },

    setMany: function(configs) {

        var count = 0

        configs && Object.keys(configs).forEach(function(name){
            var value = configs[name]
            var prop = findProperty(name)

            if (prop){
                prop.value = value
                count++
            }

        })

        if (count){
            save()
            DataManager.refresh()
            return true
        }

    },

    get: function(name) {

        var prop = findProperty(name)

        return prop.value
    },

    toggleSort: function(){
        var sortDir = DataManager.get('sortDir')
        var newValue = sortDir == 'asc'? 'desc': 'asc'

        // debugger
        DataManager.set('sortDir', newValue)
    },

    count: function() {
        return AppData.meals.length
    },

    refresh: function() {
        DataManager.emit('refresh')
    },

    getPerPeriod: function(config) {

        config = config || {}

        var limit = config.limit
        var dateFormat = config.dateFormat

        var meals = DataManager.meals

        var groups = {}
        var result = []

        meals.forEach(function(meal){

            var bucket = moment(meal.date).format(dateFormat)
            var arr = groups[bucket] = groups[bucket] || []

            arr.push(meal)
        })

        var groupName
        var groupMeals
        var groupAmount
        var groupLimit

        for (groupName in groups) if (hasown(groups, groupName)){
            groupMeals  = groups[groupName]
            groupAmount = groupMeals.reduce(function(prev, current){
                    return prev + current.amount * 1
                }, 0)

            groupLimit = typeof limit == 'function'?
                            limit(moment(groupName, dateFormat), groupAmount):
                            limit

            result.push({
                meals : groupMeals,
                date  : groupMeals[0].date,
                name  : groupName,
                amount: groupAmount,
                limit : groupLimit,
                exceeded: groupAmount > groupLimit,
                extra: groupAmount - groupLimit
            })
        }

        return result
    },

    getYearly: function(config){
        var perDay = DataManager.get('maxPerDay')

        return DataManager.getPerPeriod(copy({
            dateFormat: 'YYYY',
            limit: function(moment) {
                var days = moment.isLeapYear()? 366:365
                return days * perDay
            }
        }, config))
    },

    getMonthly: function(config){
        var perDay = DataManager.get('maxPerDay')

        return DataManager.getPerPeriod(copy({
            dateFormat: 'YYYY-MM',
            limit: function(moment) {
                return moment.daysInMonth() * perDay
            }
        }, config))
    },

    getDaily: function(config) {

        return DataManager.getPerPeriod(copy(config, {
            dateFormat: 'YYYY-MM-DD',
            limit : DataManager.get('maxPerDay')
        }))
    }
})

DataStore.on({

    onconfig: function(config){
        DataManager.set(config)
    },

    ondata: function(meals){
        DataManager.meals = meals
    }

})

var save = F.buffer(function(){
    var cfg = {}

    DataManager.configs.map(function(config){
        cfg[config.name] = config.value
    })

    DataStore.saveConfig(cfg)

}, 500)

if (typeof window != 'undefined'){
    window.DataManager = DataManager
}

module.exports = DataManager