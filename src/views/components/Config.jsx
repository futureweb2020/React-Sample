'use strict'

var React = require('react')

var LoadMask    = require('../../../react-components/LoadMask')
var NumberField = require('../../../react-components/NumberField')

var DataManager  = require('../../data/DataManager')
var StateManager = require('../../state/StateManager')

function renderOption(opt){
    return <option key={opt.name} value={opt.value}>{opt.label || opt.name}</option>
}

module.exports = React.createClass({

    displayName: 'Config',

    getInitialState: function() {
        return {}
    },

    render: function() {
        var header = "Here's your configuration:"
        var data   = DataManager.configs

        return (
            <div className="config-panel">
                <LoadMask visible={StateManager.get('initialLoad')} />
                <h2>{header}</h2>
                <table>
                    <tbody>
                    {data.map(this.renderConfig, this)}
                    </tbody>
                </table>

                <div className="status">Your configuration is automatically saved!</div>
                <button onClick={this.props.onBack}>Okay, go back</button>
            </div>
        )
    },

    renderConfig: function(config) {

        var label = config.label || config.name

        return (
            <tr key={config.name}>
                <td className="label">{label}: </td>
                <td className="editor">{this.renderEditor(config)}</td>
            </tr>
        )
    },

    renderEditor: function(config) {

        var onChange = this.handleChange.bind(this, config)
        var editor = React.DOM.input
        var props = { onChange: onChange, value: config.value }
        var children

        if (config.numbersOnly){
            editor = NumberField
        }

        if (config.options){
            editor   = React.DOM.select
            children = config.options.map(renderOption)
        }

        return editor(props, children)
    },

    handleChange: function(config, event) {

        this.onChange(config.name, event.target.value)
    },

    onChange: function(name, value) {
        DataManager.set(name, value)
    }
})