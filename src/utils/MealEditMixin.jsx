'use strict'

var copy = require('copy-utils').copy
var LoadMask = require('../../react-components/LoadMask')
var DataManager = require('../data/DataManager')
var StateManager = require('../state/StateManager')

var MealsList = require('../views/components/MealsList')

var API = require('../api')

function emptyFn(){}

module.exports = {

    getInitialState: function(){
        return {
            loading: false
        }
    },

    renderList: function(list) {
        list = list || DataManager.meals

        return <div>

                <MealsList
                    list={list}
                    onDelete={this.handleDelete}
                    onEditClick={this.handleEditClick}
                    onEditChange={this.handleEditChange}
                    onUpdateClick={this.handleUpdateClick}
                    onCancelEditClick={this.handleCancelEditClick}/>
        </div>
    },

    handleEditClick: function(meal) {
        StateManager.set('editing', copy(meal))
    },

    handleEditChange: function(meal, property, value) {
        var editing = StateManager.get('editing')

        if (editing){

            editing[property] = value

            StateManager.refresh()
        }
    },

    handleCancelEditClick: function() {
        StateManager.set('editing', null)
    },

    handleUpdateClick: function(meal) {

        StateManager.set('saving', true)

        API.put(meal, function(){
            StateManager.set('editing', null)
            StateManager.set('saving', false)
        }.bind(this))

    },

    /**
     * @param {Object} meal
     */
    handleDelete: function(meal){

        StateManager.set('saving', true)

        API.del(meal.id, function(){
            StateManager.set('saving', false)
        }.bind(this))
    }
}