'use strict'

var APP_NAME = 'calorie-warn'
var AUTH_URL = 'https://auth.firebase.com/v2/' + APP_NAME + '/auth/password?'
var BASE_URL = 'https://' + APP_NAME + '.firebaseio.com/'

module.exports = {
    appName: 'calorie-warn',
    authUrl: AUTH_URL,
    baseUrl: BASE_URL
}