'use strict'

var React = require('react')
var Router = require('react-router')

var DataManager = require('../../data/DataManager')
var logout      = require('../../signout')

function emptyFn(){}

module.exports = React.createClass({

    displayName: 'Header',

    mixins: [
        Router.ActiveState
    ],

    render: function() {

        var sortCls = DataManager.get('sortDir') == 'desc'?'sort-desc': 'sort-asc'
        var title = this.isActive('config')?
                        'Click to see meals.':
                        'Click to configure your app.'

        return (
            <div className="header">
                <h1>
                    {DataManager.get('title') || 'Calorie Calculator'}
                    <a title='Logout' className="logout" onClick={logout}/>
                    <a title={title} className="config" onMouseDown={this.handleMouseDown}/>
                    <a title='Toggle sort' className={"toggle-sort " + sortCls} onClick={DataManager.toggleSort}/>
                </h1>
            </div>
        )
    },

    handleMouseDown: function(event) {
        ;(this.props.onConfigClick || emptyFn)()
    }

})