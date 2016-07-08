'use strict'

var React  = require('react')
var Router = require('react-router')

var LoginMixin = require('./utils/LoginMixin')

module.exports = React.createClass({

    displayName: 'Logout',

    mixins: [
        LoginMixin
    ],

    componentWillMount: function(){
        this.logout()
    },

    render: function(){
        return (
            <div className="logout">Thanks for using the app. <a href="#/login">Re-login here</a></div>
        )
    }
})