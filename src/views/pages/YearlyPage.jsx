'use strict'

var React = require('react')
var PeriodPage = require('./PeriodPage')

module.exports = React.createClass({

    displayName: 'YearlyPage',

    render: function() {

        var list = DataManager.getYearly({ sort: 'asc' })

        return <PeriodPage list={list} dateFormat={'YYYY'}/>
    }
})