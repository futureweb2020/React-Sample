'use strict'

var React = require('react')
var moment = require('moment')

var DataManager = require('../../data/DataManager')
var MealsList   = require('../components/MealsList')

var MealEditMixin = require('../../utils/MealEditMixin')

var formatDay = require('../../utils/formatDay')
var formatNumber = require('../../utils/formatNumber')

module.exports = React.createClass({

    displayName: 'PeriodPage',

    mixins: [
        MealEditMixin
    ],

    render: function() {

        var groupSeparator = DataManager.get('groupSeparator')
        var dataPoints     = this.props.list

        if (!dataPoints.length){

            return <div>
                {this.renderList([])}

            </div>
        }

        var format = this.props.dateFormat || formatDay

        if (typeof format == 'string'){
            var formatPattern = format
            format = function(value){
                return moment(value).format(formatPattern)
            }
        }

        var lists = dataPoints.map(function(data){
            var meals     = data.meals
            var firstDate = meals[0].date

            var date   = format(data.date)
            var amount = formatNumber(data.amount, groupSeparator) || 0
            var extra  = data.exceeded?
                            formatNumber(data.extra, groupSeparator):
                            null

            var extraText = data.exceeded? ' (' + extra + ' extra)': ''

            return <div
                        key={data.name}
                        className={"period " + (data.exceeded? 'exceeded': '')
                    }>

                    <h2>
                        <span className="date"> {date} </span> -
                        <span className="calories"> you had {amount} calories.
                            {extraText}
                        </span>
                    </h2>
                    {this.renderList(meals)}
                </div>
        }, this)

        return <div className={(this.props.className|| '') + " period-list"}>{lists}</div>
    }
})