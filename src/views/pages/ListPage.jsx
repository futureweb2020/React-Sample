'use strict'

var React = require('react')

var DataManager
var MealEditMixin = require('../../utils/MealEditMixin')

module.exports = React.createClass({

    displayName: 'MainPage',

    mixins: [
        MealEditMixin
    ],

    render: function() {
        return this.renderList()
    }
})