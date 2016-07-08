'use strict'

var React = require('react')
var ranged = require('ranged')

module.exports = React.createClass({

    displayName: 'LoadMask',

    getDefaultProps: function() {
        return {
            visible: false
        }
    },

    render: function() {

        var classes = ['load-mask']
        if (this.props.visible){
            classes.push('visible')
        }

        var loadbars = ranged(0, 11)

        function renderLoadbar(bar, index){
            return <div key={index} className={"loadbar loadbar-" + (index+1)} />
        }

        return (
            <div className={classes.join(' ')}>
                <div className="loader">
                {loadbars.map(renderLoadbar)}
                </div>
            </div>
        )
    }

})