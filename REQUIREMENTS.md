# Calorie warn

> Write an application for the input of calories


## Description

User must be able to create an account and log in

When logged in, user can see a list of his meals and calories (user enters calories manually, no auto calculations!), also he should be able to edit and delete.

Each entry has a date, time, text, and num of calories

Filter by dates from-to, time from-to (e.g. how much calories have I had for lunch each day in the last month, if lunch is between 12 and 15h)

User setting – Expected number of calories per day

When displayed, it goes green if the total for that day is less than expected number of calories per day, otherwise goes red

Minimal UI/UX design is needed.

All actions need to be done client side using AJAX, refreshing the page is not acceptable. (If a mobile app, disregard this)

REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Parse.com, Firebase.com or similar services to create the API).

In any case you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly.