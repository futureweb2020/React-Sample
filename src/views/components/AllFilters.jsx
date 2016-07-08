'use strict'

var React = require('react')
var TimeFilter = require('./TimeFilter')
var DateFilter = require('./DateFilter')

// var StateManager = require('../../state/StateManager')

var types = {
    date: DateFilter,
    time: TimeFilter
}

function emptyFn(){}

var FilterSelector = React.createClass({
    displayName: 'FilterSelector',

    getDefaultProps: function(){
        return {
            type: 'date'
        }
    },

    render: function(){
        var theFilter = types[this.props.type]({
            value   : this.props.value,
            onChange: this.handleValueChange
        })

        return (
            <div className="filter-selector">
                <span className="filter-by">Filter by</span>
                <select value={this.props.type} onChange={this.handleTypeChange}>
                    <option key="date" value="date">Date</option>
                    <option key="time" value="time">Time</option>
                </select>

                {theFilter}
                <a onClick={this.handleRemove}>Remove</a>
            </div>
        )
    },

    handleValueChange: function(value){
        ;(this.props.onFilterValueChange || emptyFn)(value)
    },

    handleTypeChange: function(event){
        var value = event.target.value

        ;(this.props.onFilterTypeChange || emptyFn)(value)
    },

    handleRemove: function(){
        ;(this.props.onFilterRemove || emptyFn)()
    }
})


function toFilter(f, i){

    return FilterSelector({
        type : f.type,
        value: f.value,
        onFilterValueChange: this.onFilterValueChange.bind(this, f, i),
        onFilterTypeChange: this.onFilterTypeChange.bind(this, f, i),
        onFilterRemove: this.onFilterRemove.bind(this, f, i)
    })
}


module.exports = React.createClass({

    displayName: 'AllFilters',

    getDefaultProps: function() {
        return {
            filters: []
        }
    },

    render: function() {

        var filters = this.props.filters
        var count   = filters.length

        return (
            <div className="filters">
                <div className="text">
                    {!count? <span>You are currently viewing all meals. You can try to <a onClick={this.handleAddFilter}>add filters</a>.</span>: ''}
                </div>

                <div className="list">
                    {filters.map(f => toFilter.call(this, f) )}
                    {count?<a onClick={this.handleAddNewFilter} className="add-another">Add another filter</a>:null}
                </div>
            </div>
        )
    },

    handleAddFilter: function(){
        this.addFilter('date')
    },

    handleAddNewFilter: function(){
        var types = this.props.filters.map(f => f.type)

        var type
        if (~types.indexOf('date')){
            type = 'time'
        } else {
            type = 'date'
        }

        this.addFilter(type)
    },

    addFilter: function(type, value){
        if (type == 'time' && !value){
            value = this.getTimeFilterValue()
        }

        ;(this.props.onFilterAdd || emptyFn)({
            type : type,
            value: value || {}
        })
    },

    getTimeFilterValue: function(){
        return {
            from: {
                hour:0,
                minute: 0
            },
            to: {
                hour: 23,
                minute: 55
            }
        }
    },

    getDateFilterValue: function(){
        return {
            from: null,
            to: null
        }
    },

    onFilterChange: function(filter, index, value) {
        this.props.onFilterChange(filter, index, { value: value })
    },

    onFilterValueChange: function(filter, index, value) {
        this.props.onFilterChange(filter, index, { value: value })
    },

    onFilterTypeChange: function(filter, index, type) {
        var obj = { type: type }
        if (type == 'time'){
            obj.value = this.getTimeFilterValue()
        } else {
            obj.value = this.getDateFilterValue()
        }

        this.props.onFilterChange(filter, index, obj)
    },

    onFilterRemove: function(filter, index){
        this.props.onFilterRemove(filter, index)
    }

})