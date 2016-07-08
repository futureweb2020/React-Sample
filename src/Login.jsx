'use strict'

var React  = require('react')
var Router = require('react-router')

var LoginRegister = require('./LoginRegister')
var LoginMixin    = require('./utils/LoginMixin')

var StateManager = require('./state/StateManager')

module.exports = React.createClass({

    displayName: 'Login',

    mixins: [
        LoginMixin,
        Router.Navigation
    ],

    render: function(){
        return (
            <LoginRegister
                loading={this.state.loading}
                error={this.state.message}
                title={'Hello, please login'}
                text={"Login"}
                otherText={"Register"}
                otherLink={"register"}
                onClick={this.handleLogin}
            />
        )
    },

    handleLogin: function(value){

        this.login(value, function(err, authData){
            if (!err){
                StateManager.login(authData)
                this.transitionTo('/')
            }
        })
    }

})