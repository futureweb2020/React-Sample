'use strict'

var React  = require('react')
var moment = require('moment')

var DateField  = require('../../../react-components/DateField')
var formatDate = require('../../utils/formatDayNoTime')

function correct(value){
    if (value.to && value.from && value.to.isBefore(value.from)){
        value.to = moment(value.from)
    }

    return value
}

module.exports = React.createClass({

    displayName: 'DateFilter',

    getDefaultProps: function() {
        return {
            from: null,
            to  : null
        }
    },

    render: function() {

        return (
            <div className="filter filter-date">
                <span className="from">From</span>
                {this.renderFrom()}
                <span className="to">to</span>
                {this.renderTo()}
            </div>
        )
    },

    renderFrom: function() {
        return (
            <DateField dateFormat={formatDate} maxDate={this.props.value.to} date={this.props.value.from} key="from" onChange={this.handleChange.bind(this, 'from')}/>
        )
    },

    renderTo: function() {
        return (
            <DateField dateFormat={formatDate} minDate={this.props.value.from} date={this.props.value.to} key="to"onChange={this.handleChange.bind(this, 'to')}/>
        )
    },

    handleChange: function(what, value) {
        var both = {
            from: this.props.value.from,
            to  : this.props.value.to
        }

        both[what] = value

        this.props.onChange(correct(both))
    }
})