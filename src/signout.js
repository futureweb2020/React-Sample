var authStore = require('./data/AuthStore')

module.exports = function logout(){
    authStore.unauth()
    window.location.hash = '/logout'
}