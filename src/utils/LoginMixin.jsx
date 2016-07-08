'use strict'

var StateManager = require('../state/StateManager')
var authStore    = require('../data/AuthStore')
var logout       = require('../signout')

authStore.onAuth(function(authData){

    if (!authData && StateManager.isLoggedIn()){
        StateManager.logout()
        logout()
    } else if (authData){
        StateManager.login(authData)
    }
})

module.exports = {

    getInitialState: function() {
        return {
            message: ''
        }
    },

    setMessage: function(message){
        this.setState({
            message: message
        })

        setTimeout(function(){
            this.setState({
                message: ''
            })
        }.bind(this), 2000)
    },

    callback: function(fn){
        if (this.isMounted()){
            this.setState({
                loading: true
            })
        }

        return function(err){
            if (this.isMounted()){
                this.state.loading = false
                if (err){
                    this.setMessage(err.message)
                } else {
                    this.setState(this.state)
                }
            }

            !err && fn.apply(this, arguments)

        }.bind(this)
    },

    createUser: function(data, fn){
        return authStore.createUser(data, this.callback(fn))
    },

    login: function(data, fn){
        this.setState({
            loading: true
        })

        return authStore.authWithPassword(data, function(err, authData){
            fn = this.callback(fn)

            if (authData){
                authStore.child('users').child(authData.uid).set(authData)
            }

            fn.apply(this, arguments)
        }.bind(this))
    },

    logout: logout
}