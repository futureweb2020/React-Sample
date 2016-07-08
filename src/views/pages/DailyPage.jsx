'use strict'

var React = require('react')
var formatDay = require('../../utils/formatDay')

var PeriodPage = require('./PeriodPage')

module.exports = React.createClass({

    displayName: 'DailyPage',

    render: function() {

        var list = DataManager.getDaily({ sort: 'asc' })

        return <PeriodPage list={list} dateFormat={formatDay} />
    }
})