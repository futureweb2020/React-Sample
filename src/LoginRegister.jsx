'use strict'

var React  = require('react')
var Router = require('react-router')
var LoadMask = require('../react-components/LoadMask')
require('../react-components/LoadMask/index.styl')


function emptyFn(){}

module.exports = React.createClass({

    displayName: 'LoginRegister',

    mixins: [
        Router.ActiveState,
        Router.Navigation
    ],

    getInitialState: function(){
        return {
            loading: false
        }
    },

    render: function(){
        return (
            <div className="login">
                <LoadMask visible={this.props.loading} />

                <div className="login-wrap">
                <table>
                    <tbody>
                        <tr>
                            <td style={{width: 100}}></td>
                            <td></td>
                        </tr>
                        <tr className="item title">
                            <td colSpan={2}>{this.props.title}</td>
                        </tr>
                        <tr className="item error">
                            <td colSpan={2}>{this.props.error}</td>
                        </tr>
                        <tr className="item">
                            <td>Email</td>
                            <td><input type="text" name="email" placeholder="Email" onKeyDown={this.handleKeyPress}/></td>
                        </tr>
                        <tr className="item">
                            <td>Password</td>
                            <td><input type="password" name="password" placeholder="Password" onKeyDown={this.handleKeyPress}/></td>
                        </tr>
                        <tr className="item">
                            <td></td>
                            <td style={{textAlign: 'right'}}><button onClick={this.handleClick}>{this.props.text}</button></td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className="register">
                    <a href={'#/' + this.props.otherLink}>or {this.props.otherText}</a>
                </div>
            </div>
        )
    },

    handleKeyPress: function(event){
        if (event.key == 'Enter'){
            this.handleClick()
        }
    },

    handleClick: function(){
        var dom = this.getDOMNode()

        var emailInput = dom.querySelector('[name=email]')
        var passInput  = dom.querySelector('[name=password]')

        ;(this.props.onClick || emptyFn)({
            email: emailInput.value,
            password : passInput.value
        })
    }

})