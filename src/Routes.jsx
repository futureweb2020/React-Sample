'use strict'

var React  = require('react')
var Router = require('react-router')

var Route         = Router.Route
var Routes        = Router.Routes
var NotFoundRoute = Router.NotFoundRoute
var DefaultRoute  = Router.DefaultRoute

var ConfigPage = require('./views/pages/ConfigPage')
var Login      = require('./Login')
var Logout     = require('./Logout')
var Register   = require('./Register')
var App        = require('./App')
var TabbedPage = require('./views/pages/TabbedPage')

module.exports = (
    <Routes location="hash">
        <Route name="app" path="/" handler={App}>
            <Route name="config" handler={ConfigPage} />

            <Route name="login" path="/login" handler={Login} />
            <Route name="logout" path="/logout" handler={Logout} />
            <Route name="register" path="/register" handler={Register} />

            <DefaultRoute handler={TabbedPage}/>
            <NotFoundRoute handler={TabbedPage}/>
        </Route>


    </Routes>
)
