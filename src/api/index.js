'use strict'

var CONFIG   = require('../data/config')
var BASE_URL = CONFIG.baseUrl
var AUTH_URL = CONFIG.authUrl
var APP_NAME = CONFIG.appName
var LOCAL_STORAGE_KEY = 'firebase:session::' + APP_NAME

var request      = require('superagent')
var StateManager = require('../state/StateManager')

function url(id){
    var authData = StateManager.isLoggedIn()
    return BASE_URL + 'userdata/' + authData.uid + '/meals' + (id?'/' + id: '') + '.json'
}

function emptyFn(){}

/**
 * This API is a wrapper over Firebase's REST API.
 *
 * Use this api to post (add), put (update), delete, get meals
 *
 * Also you can use it for authentication.
 */
var API = {

    /**
     * Authenticates with the given email and password.
     *
     * @param  {Object} data
     * @param  {String} data.email
     * @param  {String} data.password
     */
    auth: function(data){
        var url   = AUTH_URL
        var query = Object.keys(data).map(function(key){
            return key + '=' + data[key]
        }).join('&')

        request.get(url + query)
            .end(function(response){
                var body = response.body
                if (body){
                    StateManager.login(body)
                    window.location.hash = '/'
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(body))
                }
            })
    },

    /**
     * Publish a new meal given as json
     *
     * @param  {Object}   json
     * @param  {Function} [callback]
     */
    post: function(json, callback) {

        if (json.date){
            json.date = +json.date
        }

        request.post(url())
            .send(json)
            .end(callback || emptyFn)
    },

    /**
     * Updates the given meal with the json data
     *
     * @param  {Object}   json
     * @param  {Function} [callback]
     */
    put: function(json, callback) {
        if (json.date){
            json.date = +json.date
        }

        request.put(url(json.id))
            .send(json)
            .end(callback || emptyFn)
    },

    get: function(callback){
        request.get(url(), callback || emptyFn)
    },

    getUrl: function(url, callback) {
        request.get(url, callback || emptyFn)
    },

    /**
     * Delete the meal with the given id
     * @param  {String}   id
     * @param  {Function} [callback]
     */
    del: function(id, callback){
        request.del(url(id))
            .end(callback || emptyFn)
    }
}

if (typeof window != 'undefined'){
    window.api = API
}
module.exports = API