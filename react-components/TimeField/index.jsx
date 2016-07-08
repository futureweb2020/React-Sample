'use strict'

var React  = require('react')
var ranged = require('ranged')

function emptyFn(){}

function pad(value){
    if (value < 10){
        return '0' + value
    }

    return value
}

module.exports = React.createClass({

    displayName: 'TimeField',

    getDefaultProps: function() {
        return {
            hour  : null,
            minute: null
        }
    },

    render: function() {

        var now    = new Date()
        var hour   = this.props.hour == null? now.getHours(): this.props.hour || 0
        var minute = this.props.minute || 0

        if (minute % 5 != 0){
            minute -= minute % 5
        }

        return (
            <div className="time-field">
                {this.renderHour(hour)}{"\u00a0"}:
                {"\u00a0"}{this.renderMinute(minute)}
            </div>
        )
    },

    renderHour: function(hour) {
        var options = ranged(0, 23).map(pad).map(v => <option key={v} value={v}>{v}</option>)

        return (
            <select ref="hour" className="select-hour" value={pad(hour)} onChange={this.handleChange}>
            {options}
            </select>
        )
    },

    renderMinute: function(value) {
        var all = ranged(0, 59).filter(v => v % 5 == 0).map(pad).map(v => <option key={v} value={v}>{v}</option>)

        return (
            <select ref="minute" className="select-minute" value={pad(value)} onChange={this.handleChange}>
            {all}
            </select>
        )
    },

    handleChange: function() {
        var hour   = this.refs.hour.getDOMNode().value
        var minute = this.refs.minute.getDOMNode().value

        var value = {
            hour  : parseInt(hour),
            minute: parseInt(minute)
        }

        ;(this.props.onChange || emptyFn)(value)
    }
})