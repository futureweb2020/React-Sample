'use strict'

var Firebase = require('firebase')
var base     = require('./Firebase')

var Emitter = require('zemitter')

var StateManager = require('../state/StateManager')
var ref

function onLogin(authData){
    authData = authData || StateManager.isLoggedIn()

    var uid = authData.uid
    var userData = base.child('userdata').child(uid)

    userData
        .child('config')
        .once('value', DataStore.onConfig)

    ref = userData.child('meals')

    ref.on('value', DataStore.onData)
}


var DataStore = Emitter({

    onConfig: function(snapshot) {
        DataStore.emit('onconfig', snapshot.val())
    },

    onData: function(snapshot){

        var meals  = snapshot.val() || []

        var k
        var result = []
        var meal

        for(k in meals){
            meal = meals[k]
            meal.id = k
            result.push(meal)
        }

        var initialLoad = StateManager.get('initialLoad')
        StateManager.set('initialLoad', false)
        DataStore.emit('ondata', result)
    },

    addMeal: function(meal, cb){
        ref && ref.push(meal, function(err){
            cb(err)
        })
    },

    saveConfig: function(config) {
        var authData = StateManager.isLoggedIn() || {}
        var uid = authData.uid

        uid && base.child('userdata').child(uid).update({config: config})
    },

    onLogin: onLogin
})

if (StateManager.isLoggedIn()){
    onLogin()
}

StateManager.on({
    login: function(){
        onLogin()
    },

    logout: function(){
        ref && ref.off('value', DataStore.onData)
    }
})


module.exports = DataStore