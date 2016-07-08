'use strict'

var React = require('react')
var copy = require('copy-utils').copy
var Region = require('region-align')
var DatePicker = require('react-date-picker')
var moment = require('moment')
var F = require('functionally')

require('react-date-picker/index.styl')
require('./index.styl')

var seed = 100
var increment = 10

function stopEvent(event){
    event.stopPropagation()
    event.nativeEvent.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    event.nativeEvent.preventDefault()
}

function emptyFn(){}

var DatePickerLayer = React.createClass({
    displayName: 'DatePickerLayer',

    componentWillMount: function() {
        ;(this.props.onMount || emptyFn)(this)
    },

    getInitialState: function() {
        return {
            value: ''
        }
    },

    render: function() {
        return DatePicker(this.props)
    }
})

module.exports = React.createClass({

    displayName: 'DateField',

    render: function() {
        var props = copy(this.props)
        var date  = props.date || ''
        var value = date

        var dateFormat = this.props.dateFormat

        if (date){
            date = moment(date)
            value = dateFormat && typeof dateFormat == 'function'?
                        dateFormat(date):
                        date.format(dateFormat || 'YYYY-MM-DD')
        }

        if (this.picker){
            setTimeout(function(){
                this.picker && this.picker.setProps({
                    date   : date,
                    minDate: this.props.minDate,
                    maxDate: this.props.maxDate
                })
            }.bind(this), 0)
        }

        return <input
                    readOnly={true}
                    className="date-field"
                    value={value}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onClick={this.onInputClick}/>
    },

    onInputClick: function(event){
        // stopEvent(event)
    },

    onDocumentClick: function(event){
        if (event.target != this.getDOMNode()){
            this.hideLayer()
        }
    },

    prepareLayerZIndex: function(){
        return seed = seed + increment
    },

    createLayer: function() {
        if (!this.layer){
            this.layer = document.createElement('div')
            this.layerTarget = (this.props.getTarget || emptyFn)() || document.body

            this.layerTarget.appendChild(this.layer)

            copy({
                position: 'absolute',
                top: 0
            }, this.layer.style)

            var setPicker = (function(picker){
                this.picker = picker
            }).bind(this)

            React.renderComponent(<DatePickerLayer minDate={this.props.minDate} maxDate={this.props.maxDate} onMount={setPicker} date={this.props.date} onChange={this.onPickerChange} onClick={this.handlePickerClick} />, this.layer)

            document.addEventListener('click', this.onDocumentClick)
            window.addEventListener('resize', this.onWinResize = F.buffer(this.onWindowResize, 10))
        }
    },

    handleFocus: function() {

        this.createLayer()
        this.showLayer()

    },

    onWindowResize: function(){
        if (this.layerVisible){
            this.showLayer()
        }
    },

    prepareLayerPosition: function(){
        var inputRegion = Region.from(this.getDOMNode())
        var layerRegion = Region.from(this.layer)

        // debugger
        layerRegion.alignTo(this.getDOMNode(), ['tl-bl', 'tr-br', 'br-tr', 'bl-tl', 'tl-bl'], { constrain: true})

        if (this.props.adjustRegion){
            this.props.adjustRegion(layerRegion, this.layerTarget)
        } else {
            var targetRegion = Region.from(this.layerTarget)

            layerRegion.top -= targetRegion.top
            layerRegion.left -= targetRegion.left
        }

        ;(this.props.adjustRegion || emptyFn)(layerRegion)

        return {
            top : layerRegion.top + 'px',
            left: layerRegion.left + 'px'
        }
    },

    handlePickerClick: function(event) {
        stopEvent(event)

        if (this.layerVisible){
            this.getDOMNode().focus()
        }
    },

    componentWillUnmount: function(){
        this.hideLayer()
        this.removeLayer()
    },

    showLayer: function() {
        this.layer.style.zIndex = this.prepareLayerZIndex()
        this.layer.style.display = 'block'

        var pos = this.prepareLayerPosition()
        copy(pos, this.layer.style)

        this.layerVisible = true
    },

    hideLayer: function(){
        this.layer && (this.layer.style.display = 'none')
        this.layerVisible = false
    },

    removeLayer: function(){
        if (this.layer){
            this.picker = null
            React.unmountComponentAtNode(this.layer)
            document.removeEventListener('click', this.onDocumentClick)
            window.removeEventListener('resize', this.onWinResize)

            this.layerTarget.removeChild(this.layer)
            this.layerTarget = null
        }
    },

    onPickerChange: function(date, event){
        event.skipFocus = true

        this.hideLayer()

        // debugger
        ;(this.props.onChange || emptyFn)(date)
    }

})