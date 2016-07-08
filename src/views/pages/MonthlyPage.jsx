'use strict'

var React = require('react')
var formatMonth = require('../../utils/formatMonth')
var PeriodPage = require('./PeriodPage')

module.exports = React.createClass({

    displayName: 'MonthlyPage',

    render: function() {

        var list = DataManager.getMonthly({ sort: 'asc' })

        return <PeriodPage list={list} dateFormat={formatMonth} />
    }
})