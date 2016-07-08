'use strict'

var React  = require('react')
var Router = require('react-router')
var F      = require('functionally')
var Tabs   = require('react-simpletabs')

var ListPage    = require('./ListPage')
var DailyPage   = require('./DailyPage')
var MonthlyPage = require('./MonthlyPage')
var YearlyPage  = require('./YearlyPage')

var LoadMask = require('../../../react-components/LoadMask')

var StateManager = require('../../state/StateManager')
var AddMeal  = require('../components/AddMeal')

var TABS = [
    {
        render: AddMeal,
        path: '/add',
        title: 'Add Meal'
    },
    {
        render: ListPage,
        path: '/',
        title: 'All Meals'
    },
    {
        render: DailyPage,
        path: '/daily',
        title: 'Daily Meals'
    },
    {
        render: MonthlyPage,
        path: '/monthly',
        title: 'Monthly Meals'
    },
    {
        render: YearlyPage,
        path: '/yearly',
        title: 'Yearly Meals'
    }
]

var renderTab = F.curry(function(self, props, tab){

    return <Tabs.Panel key={tab.title} title={tab.title}>
                {tab.render(props)}
            </Tabs.Panel>
})

module.exports = React.createClass({

    displayName: 'TabbedPage',

    mixins: [
        Router.ActiveState,
        Router.Navigation
    ],

    render: function(){
        var activeIndex = 1
        var showMask    = StateManager.get('initialLoad') || StateManager.get('saving')

        TABS.forEach(function(tab, index){
            if (this.isActive(tab.path)){
                activeIndex = index + 1
            }
        }, this)

        var props = {}

        return (
            <div className="tabbed">
                <LoadMask visible={showMask} />
                <Tabs tabActive={activeIndex} onAfterChange={this.handleChange}>
                    {TABS.map(renderTab(this, props))}
                </Tabs>
            </div>
        )
    },

    handleChange: function(index) {
        var tab = TABS[index - 1]

        tab && this.transitionTo(tab.path)

        //cancel current editing meal
        StateManager.set('editing', null)
    }
})