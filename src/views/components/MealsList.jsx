'use strict'

var React = require('react')

var StateManager  = require('../../state/StateManager')
var findIndexById = require('../../utils/findIndexBy').id
var formatDate    = require('../../utils/formatDayNoTime')
var ATTRIBUTES    = require('../../utils/attributes')

function emptyFn(){}

module.exports = React.createClass({

    displayName: 'MealsList',

    render: function() {

        var list = this.props.list
        var editing = StateManager.get('editing')

        if (editing){
            var index = findIndexById(list, editing.id)

            if (~index){
                list = list.slice()
                list[index] = editing
            }
        }

        return (
            <div className="meals-list">
                <table>
                    <thead className="header">
                        <tr>
                            {ATTRIBUTES.map(this.renderHeaderCell)}
                            <th className="actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {list.map(this.renderMeal, this)}
                    </tbody>
                </table>
            </div>
        )
    },

    renderHeaderCell: function(attr){
        var style = {}
        var text  = attr.label || attr.name

        if (attr.width){
            style.width = attr.width
        }

        return <th style={style} className={'attribute-'+attr.name} key={attr.name}>{text}</th>
    },

    renderMeal: function(meal) {
        var key = meal.id || meal.text
        var cols = ATTRIBUTES.map(this.renderAttribute.bind(this, meal))

        cols.push(
            <td className={"actions " + (StateManager.isEdited(meal)? 'editing': '')} key="action">
                <div className="action undo-action " onClick={this.handleCancelEdit.bind(this, meal)}></div>
                <div className="action edit-action " onClick={this.handleEdit.bind(this, meal)}></div>
                <div className="action delete-action" onClick={this.handleDelete.bind(this, meal)}></div>
            </td>
        )

        return (
            <tr key={key} className="meal-row">
                {cols}
            </tr>
        )
    },

    renderAttribute: function(meal, attr, index) {
        var name  = attr.name
        var value = meal[name]
        var key   = meal.id || meal.text
        var edited = StateManager.isEdited(meal)

        if (attr.render && !edited){
            value = attr.render(value, meal)
        }

        var editor = (attr.editor || React.DOM.input)({
                        autoFocus: index==0,
                        key: name,
                        value: value,
                        dateFormat: formatDate,
                        placeholder: attr.label || attr.name,
                        onKeyDown: this.handleKeyPress.bind(this, meal, attr),
                        onChange: this.handleChange.bind(this, meal, attr)
                    })

        return React.DOM.td({
            key: name,
            className: 'attribute-' + name
        }, edited?editor: value)
    },

    handleKeyPress: function(meal, attr, event) {

        if (event.key == 'Enter'){
            this.handleCompleteEdit(meal)
        }
    },

    handleChange: function(meal, attr, event) {

        var value = event

        if (event && event.target && typeof event.target.value != 'undefined'){
            value = event.target.value
        }

        ;(this.props.onEditChange || emptyFn)(meal, attr.name, value)
    },

    handleCancelEdit: function(meal) {
        ;(this.props.onCancelEditClick || emptyFn)()
    },

    handleEdit: function(meal) {

        if (!this.handleCompleteEdit(meal)){
            ;(this.props.onEditClick || emptyFn)(meal)
        }
    },

    handleCompleteEdit: function(meal) {
        if (StateManager.isEdited(meal)){
            //just confirmed meal values
            ;(this.props.onUpdateClick || emptyFn)(meal)

            return true
        }
    },

    handleDelete: function(meal) {
        ;(this.props.onDelete || emptyFn)(meal)
    }
})