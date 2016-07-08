'use strict'

var React = require('react')
var copy  = require('copy-utils').copy

var TimeField     = require('../../../react-components/TimeField')
var LoadMask      = require('../../../react-components/LoadMask')
var NumberField   = require('../../../react-components/NumberField')
var DateField     = require('../../../react-components/DateField')
var DateTimeField = require('../../../react-components/DateTimeField')

require('../../../react-components/DateTimeField/index.styl')

var formatDate = require('../../utils/formatDayNoTime')

var API = require('../../api')

var StateManager = require('../../state/StateManager')
var DataManager  = require('../../data/DataManager')
var moment       = require('moment')

module.exports = React.createClass({

    displayName: 'AddMeal',

    getDefaultProps: function() {
        return {
        }
    },

    getInitialState: function(){
        return {
            message: '',
            loading: false
        }
    },

    render: function() {

        var values = StateManager.get('newMeal')

        values.date = moment(values.date || +new Date())

        var hour   = values.date.get('hour')
        var minute = values.date.get('minute')

        if (values.amount == null){
            values.amount = ''
        }

        return (
            <div className="add-meal">
                <LoadMask visible={this.state.loading} />

                <fieldset>
                    <div className="description item error">
                        <span>{this.state.message}</span>
                    </div>

                    <div className="description item">
                        <span>Description</span>
                        <input value={values.text} type="text" onChange={this.handleTextChange} onKeyDown={this.handleKeyPress}/>
                    </div>

                    <div className="calories item">
                        <span>Calories</span>
                        <NumberField value={values.amount} type="text" onChange={this.handleAmountChange} onKeyDown={this.handleKeyPress}/>
                    </div>

                    <div className="date item">
                        <span>Date</span>
                        <DateTimeField dateFormat={formatDate} value={values.date} onChange={this.handleDateChange}/>
                    </div>

                    <legend>Add Meal</legend>
                    <button onClick={this.handleClick}>Add</button>
                </fieldset>
            </div>
        )
    },

    handleKeyPress: function(event){
        if (event.key == 'Enter'){
            this.handleClick()
        }
    },

    handleClick: function(){
        var meal = StateManager.get('newMeal')

        if (!meal.text || !meal.amount){
            this.setState({
                message: 'Please provide a description and some calories'
            })

            return
        }

        this.post(meal)
    },

    post: function(meal){
        meal = copy(meal)

        this.setState({
            loading: true,
            message: ''
        })

        API.post(meal, function(response){
            var err = response.error
            this.setState({
                loading: false,
                message: err? err.message: ''
            })

            if (!err){
                StateManager.clearMeal()
            }
        }.bind(this))

        // DataManager.add({x: function(){}}, function(err){
        //     this.setState({
        //         loading: false,
        //         message: err? err.message: ''
        //     })

        //     if (!err){
        //         StateManager.clearMeal()
        //     }
        // }.bind(this))
    },

    handleTextChange: function(event){
        this.set('text', event.target.value)
    },

    handleAmountChange: function(event){
        this.set('amount', event.target.value)
    },

    handleDateChange: function(date){
        // console.log(date.format('YYYY MM DD HH:M'))
        this.set('date', +date)
    },

    set: function(name, value){
        var obj = {}
        obj[name] = value
        StateManager.updateNewMeal(obj)
    }
})