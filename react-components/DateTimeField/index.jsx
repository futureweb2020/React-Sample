'use strict'

var React  = require('react')
var moment = require('moment')

var DateField = require('../DateField')
var TimeField = require('../TimeField')


function emptyFn(){}

module.exports = React.createClass({

    displayName: 'DateTimeField',

    getDefaultProps: function() {
        return {
            value: null
        }
    },

    getValue: function(v){
        var now    = moment()
        var value  = moment(this.props.value || now)

        var hour   = value.get('hour')
        var minute = value.get('minute')

        minute = minute - minute % 5

        value = moment(value).startOf('day')

        return {
            date  : value,
            hour  : hour,
            minute: minute
        }
    },

    render: function() {

        var value = this.getValue()
        var date   = value.date
        var minute = value.minute
        var hour   = value.hour

        return (
            <div className="date-time-field">
                <DateField dateFormat={this.props.dateFormat} getTarget={this.getTarget} date={date} onChange={this.onDateChange}/>{"\u00a0"}
                <TimeField minute={minute} hour={hour} onChange={this.onTimeChange}/>
            </div>
        )
    },

    getTarget: function() {

        var node = this.getDOMNode()

        while (node && !node.classList.contains('meals-list')){
            node = node.parentElement
        }

        return node || this.getDOMNode()
    },

    onDateChange: function(date){
        var value = this.getValue()

        date = moment(date).add(value.hour, 'hour')
        date.add(value.minute, 'minute')

        ;(this.props.onChange || emptyFn)(date)
    },

    onTimeChange: function(time){
        var value = this.getValue()

        var date = moment(value.date)
        date.add(time.hour, 'hour')
        date.add(time.minute, 'minute')

        ;(this.props.onChange || emptyFn)(date)
    }
})