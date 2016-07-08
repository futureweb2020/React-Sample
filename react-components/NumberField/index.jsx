'use strict'

var React    = require('react')
var copy     = require('copy-utils').copy
var copyIf   = require('copy-utils').copyIf
var document = global.document

//from http://javascript.nwbox.com/cursor_position/, but added the !window.getSelection check, which
//is needed for newer versions of IE, which adhere to standards
function getSelectionStart(o) {
    if (o.createTextRange && !global.getSelection) {
        var r = document.selection.createRange().duplicate()
        r.moveEnd('character', o.value.length)
        if (r.text == '') return o.value.length
        return o.value.lastIndexOf(r.text)
    } else return o.selectionStart
}

function getSelectionEnd(o) {
    if (o.createTextRange && !global.getSelection) {
        var r = document.selection.createRange().duplicate()
        r.moveStart('character', -o.value.length)
        return r.text.length
    } else return o.selectionEnd
}

var isNumeric = require('i-s').numeric

function emptyFn(){}

var ALLOWED = {
    ' ': 1,
    '.': 1,
    '-': 1,
    '+': 1,
    '0': 1,
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '6': 1,
    '7': 1,
    '8': 1,
    '9': 1
}

module.exports = React.createClass({

    displayName: 'NumberField',


    handleKeyPress: function(event){
        var keyName = event.key
        var code = event.which || event.keyCode

        if (keyName != 'Unidentified' && keyName.length > 1){
            //not a printable character
        } else {

            var value = this.getValue() + ''
            var range = this.getSelectedRange()

            var beforeValue = value.substring(0, range.start)
            var afterValue  = value.substring(range.end)

            var key = ''

            if (code != 13 /* ENTER */){
                key = String.fromCharCode(event.which || event.keyCode)
            }

            var newValue = beforeValue + key + afterValue

            if (!ALLOWED[key] || newValue !== '' && !this.isValidValue(newValue)){
                event.preventDefault()
                return false
            }
        }

        ;(this.props.onKeyPress || emptyFn)(event)

    },

    render: function(){

        var props = copyIf(this.props, this.getInputProps())

        return React.DOM.input(props)
    },

    getDefaultProps: function(){
        var result = {}

        copy({
            minValue   : null,
            maxValue   : null,
            step       : 1,
            shiftStep  : 10,
            // numbersOnly: true,
            style: {},
            requireFocusOnStep: true,
            stepOnWheel: true
        }, result)

        return result
    },

    getStepValue: function(value, direction, config){
        config = config || {}
        if (!value){
            value = 0
        }

        if (typeof value == 'string'){
            value = parseFloat(value)
        }

        var stepValue = this.props.step

        if (config.shiftKey && this.props.shiftStep){
            stepValue = this.props.shiftStep
        }

        return value + direction * stepValue
    },

    getValue: function(){
        return this.props.value || ''
    },

    isValidValue: function(value){
        if (!isNumeric(value)){
            return false
        }

        return this.isMinValueRespected(value) && this.isMaxValueRespected(value)
    },

    stepTo: function(direction, config){
        var value = this.getValue()

        if (this.props.step){
            value = this.getStepValue(value, direction, config)
            var valid = this.isValidValue(value)

            if (!valid && !this.isMinValueRespected(value)){
                value = this.props.minValue
                valid = this.isValidValue(value)
            }

            if (!valid && !this.isMaxValueRespected(value)){
                value = this.props.maxValue
                valid = this.isValidValue(value)
            }

            if (valid){
                this.setValue(value, config)
            }
        }

        return value
    },

    /**
     * Returns true if the given value is >=  than #minValue
     * @param  {Number/String}  value
     * @return {Boolean}
     */
    isMinValueRespected: function(value){
        var minValue = this.props.minValue

        if (minValue == null || value === ''){
            return true
        }

        return value >= minValue
    },

    /**
     * Returns true if the given value is <=  than #maxValue
     * @param  {Number/String}  value
     * @return {Boolean}
     */
    isMaxValueRespected: function(value){
        var maxValue = this.props.maxValue

        if (maxValue == null || value === ''){
            return true
        }

        return value <= maxValue
    },

    getInitialState: function(){
        return {}
    },

    getInputProps: function(){
        var props = copy(this.props)

        props.type     = 'text'
        props.onFocus  = this.handleFocus
        props.onBlur   = this.handleBlur
        props.onChange = this.handleChange
        props.onWheel    = this.handleWheel
        props.onKeyPress = this.handleKeyPress

        return props
    },

    getSelectedRange: function(){
        var dom = this.getDOMNode()

        return {
            start: getSelectionStart(dom),
            end  : getSelectionEnd(dom)
        }
    },

    handleWheel: function(event) {
        var props = this.props
        if ((props.requireFocusOnStep && this.isFocused() || !props.requireFocusOnStep) && props.stepOnWheel && props.step){
            event.preventDefault()

            var nativeEvent = event.nativeEvent
            var y = nativeEvent.wheelDeltaY || nativeEvent.wheelDelta || -nativeEvent.deltaY

            y = y < 0? -1:1

            this.stepTo(y, {
                shiftKey: event.shiftKey,
                event   : event
            })
        }
    },

    isFocused: function() {
        return this._focused
    },
    handleFocus: function(event){
        this._focused = true

        ;(this.props.onFocus || emptyFn)(event)
    },
    handleBlur: function(event) {
        this._focused = false

        ;(this.props.onBlur || emptyFn)(event)
    },

    handleChange: function(event){
        // event && event.stopPropagation && event.stopPropagation()
        // event.target.value = parseFloat(event.target.value)
        ;(this.props.onChange || emptyFn)(event)
    }
})