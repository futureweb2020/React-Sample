'use strict'

var React = require('react')

var TimeField = require('../../../react-components/TimeField')

function fix(obj){

    if (obj.hour == null){
        obj.hour = new Date().getHours()
    }

    obj.minute = obj.minute || 0
}

function correct(filter){
    if (filter.from.hour > filter.to.hour){
        filter.to.hour = filter.from.hour
    }

    if (filter.from.minute > filter.to.minute){
        filter.to.minute = filter.from.minute
    }

    return filter
}

module.exports = React.createClass({

    displayName: 'TimeFilter',

    getDefaultProps: function() {
        return {
            value: {
                from: {},
                to  : {}
            }
        }
    },

    render: function() {

        this.props.value = this.props.value || {}
        this.props.value.from = this.props.value.from || {}
        this.props.value.to = this.props.value.to || {}

        fix(this.props.value.from)
        fix(this.props.value.to)

        return (
            <div className="filter filter-time">
                <span className="from">From</span>
                {this.renderFrom()}
                <span className="to">to</span>
                {this.renderTo()}
            </div>
        )
    },

    renderFrom: function() {
        return (
            <TimeField hour={this.props.value.from.hour} minute={this.props.value.from.minute} key="from" onChange={this.handleChange.bind(this, 'from')}/>
        )
    },

    renderTo: function() {
        return (
            <TimeField hour={this.props.value.to.hour} minute={this.props.value.to.minute} key="to"onChange={this.handleChange.bind(this, 'to')}/>
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