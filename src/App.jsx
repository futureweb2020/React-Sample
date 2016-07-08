'use strict'

var React  = require('react')
var Router = require('react-router')

var DataManager  = require('./data/DataManager')
var StateManager = require('./state/StateManager')

var AllFilters = require('./views/components/AllFilters')
var Header     = require('./views/components/Header')

var Logout = require('./Logout')
var Login  = require('./Login')

var CONFIG_CLICKED

/**
 * This is the topmost component rendered by the router
 *
 * Whenever app data or app state changes, we refresh all the app UI to-down.
 * Since React handles this for us, it performs re-rendering in a very performant manner.
 */

module.exports = React.createClass({

    displayName: 'App',

    mixins: [
        Router.ActiveState,
        Router.Navigation
    ],

    componentDidMount: function() {
        DataManager.on('refresh', this.shouldRefresh, this)
        StateManager.on('refresh', this.shouldRefresh, this)
    },

    componentWillUnmount: function() {
        DataManager.off('refresh', this.onDataChange)
        StateManager.off('refresh', this.shouldRefresh)
    },

    shouldRefresh: function() {
        this.setState({})
    },

    render: function(){

        var loginRequired = !this.isActive('login') && !this.isActive('register') && !this.isActive('logout')
        var showHeader    = loginRequired

        if (loginRequired && !StateManager.isLoggedIn()){
            return <div className="app">
                <div className="body">
                    <Login />
                </div>
            </div>
        }

        return (
            <div className="app">
                {showHeader?<Header onConfigClick={this.handleConfigClick} />:null}
                <div className="body">
                    {showHeader && !this.isActive('config')?<AllFilters filters={StateManager.get('filters')} onFilterChange={this.handleFilterChange} onFilterAdd={this.handleFilterAdd} onFilterRemove={this.handleFilterRemove}/>: null}
                    <this.props.activeRouteHandler />
                </div>
            </div>
        )
    },

    handleFilterAdd: function(filter){
        StateManager.addFilter(filter)
    },

    handleFilterChange: function(filter, index, changed) {
        StateManager.updateFilter(filter, changed)
    },

    handleFilterRemove: function(filter, index) {
        StateManager.removeFilter(filter)
    },

    handleConfigClick: function() {
        this.isActive('config')?
            CONFIG_CLICKED?
                this.goBack():
                this.transitionTo('/')
            :
            this.transitionTo('config')

        CONFIG_CLICKED = true
    }

})