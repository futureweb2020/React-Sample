'use strict'

var React = require('react')
var Router = require('react-router')

var Config = require('../components/Config')

module.exports = React.createClass({

    displayName: 'ConfigPage',

    mixins: [
        Router.Navigation
    ],

    render: function(){
        return <Config onBack={this.handleConfigClick}/>
    },

    handleConfigClick: function() {
        this.goBack()
    }

})