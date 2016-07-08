'use strict'

var copy = require('copy-utils').copy

/**
 * Manages application state.
 *
 * Whenever the app state changes, it triggers a 'refresh' event
 */

var Emitter = require('zemitter')
var State   = require('./AppState')

var Manager = Emitter({

    isLoaded: function() {
        return !Manager.get('initialLoad')
    },

    set: function(name, value) {
        State[name] = value

        Manager.refresh()
    },

    get: function(name) {
        return State[name]
    },

    addFilter: function(filter) {
        State.filters.push(filter)

        Manager.refresh()
    },

    updateFilter: function(filter, values) {
        var index = State.filters.indexOf(filter)

        this.updateFilterAt(index, values || filter)
    },

    updateFilterAt: function(index, values) {
        var f = State.filters[index]

        if (f){
            copy(values, f)

            Manager.refresh()
        }
    },

    removeFilter: function(filter) {
        var index = State.filters.indexOf(filter)

        if (~index){
            State.filters.splice(index, 1)
            Manager.refresh()
        }
    },

    clearFilters: function() {
        if (State.filters.length){
            State.filters.length = 0
            Manager.refresh()
        }
    },

    isEdited: function(meal) {
        return State.editing && State.editing.id == meal.id
    },

    refresh: function() {

        this.emit('refresh')
    },

    updateNewMeal: function(values){
        var meal = Manager.get('newMeal')

        copy(values, meal)

        Manager.refresh()
    },

    clearMeal: function(){
        Manager.updateNewMeal({
            id    : null,
            date  : null,
            text  : '',
            amount: null
        })
    },

    /**
     * Set authentication data and emit 'login' event
     * @param  {Object} authData
     */
    login: function(authData){
        Manager.set('authData', authData)

        this.emit('login', authData)
    },

    /**
     * Clear authentication data and emit 'logout' event
     */
    logout: function(){
        State.authData = null

        Manager.refresh()

        this.emit('logout')
    },

    /**
     * Return the authentication data if the user is logged in
     * @return {Object}
     */
    isLoggedIn: function(){
        return State.authData
    }
})

if (typeof window != 'undefined'){
    window.StateManager = Manager
}
module.exports = Manager