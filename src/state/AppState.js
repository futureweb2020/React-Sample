'use strict'

/**
 * The state of the app - not persistent between refreshes
 *
 * In order to modify app state, please use StateManager
 *
 *
 */
module.exports = {

    editing: null,

    initialLoad: true,

    authData : null,
    userEmail: '',

    newMeal: {
        id    : null,
        date  : null,
        text  : '',
        amount: null
    },

    filters: []

}