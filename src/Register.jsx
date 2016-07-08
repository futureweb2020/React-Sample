'use strict'

var React  = require('react')
var Router = require('react-router')

var LoginRegister = require('./LoginRegister')
var LoginMixin = require('./utils/LoginMixin')

module.exports = React.createClass({

    displayName: 'Register',

    mixins: [
        LoginMixin,
        Router.Navigation
    ],

    render: function(){
        return (
            <LoginRegister
                loading={this.state.loading}
                title={'Welcome, please register'}
                error={this.state.message}
                text={"Register"}
                onClick={this.handleRegister}
                otherText={"Login"}
                otherLink={"login"}
            />
        )
    },

    handleRegister: function(value){

        this.createUser(value, function(err){
            !err && this.transitionTo('login')
        })

    }

})