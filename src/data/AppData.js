'use strict'

/**
 * This is the data displayed in the app.
 *
 * In order to modify the data, please use the DataManager
 */

var AppData = {

    configs: [
        {
            name: 'title',
            label: 'Application title',
            value: 'Calorie Calculator'
        },
        {
            name: 'maxPerDay',
            label: 'Maximum calories per day',
            value: 2000,
            numbersOnly: true
        },
        {
            name: 'dateFormat',
            label: 'Date format',
            value: 'long',
            options: [
                {value: 'long', name: 'long - Oct 22, 2014'},
                {value: 'iso', name: 'iso - 2014-10-30'},
                {value: 'fromNow', name: 'fromNow - a month ago'}
            ]
        },
        {
            name: 'groupSeparator',
            label: 'Group separator',
            value: '.',
            options: [
                { value: '.', name: 'dot - 1.234.567'},
                { value: ',', name: 'comma - 1,234,567'}
            ]
        },
        {
            label: 'Sort Direction',
            name: 'sortDir',
            value: 'asc',
            options: [
                {value: 'asc', name: 'Ascending'},
                {value: 'desc', name: 'Descending'}
            ]
        }
    ],

    meals: [
        // {
        //     id: 1,
        //     date: new Date(),
        //     text: 'Pizza',
        //     amount: 1234567
        // },
        // {
        //     id: 2,
        //     date: new Date(),
        //     text: 'lunch Pizza',
        //     amount: 345
        // },
        // {
        //     id: 4,
        //     date: new Date(2010, 11, 5),
        //     text: 'Pizza',
        //     amount: 345
        // },
        // {
        //     id: 5,
        //     date: new Date(2010, 11, 6),
        //     text: 'Pizza new',
        //     amount: 34
        // },
        // {
        //     id: 3,
        //     date: new Date(),
        //     text: 'dinner',
        //     amount: 345
        // }
    ]
}

module.exports = AppData