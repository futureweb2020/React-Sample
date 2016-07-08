'use strict'

var should = require('should')

xdescribe('DataManager', function() {

    var DataManager = require('../src/data/DataManager')

    beforeEach(DataManager.clear)

    it('should add meal', function() {

        var timestamp = +new Date()

        var meal = {
            text: 'scrambled eggs',
            amount: 500,
            date: timestamp
        }

        meal = DataManager.add(meal)

        meal.id
            .should
            .not.be
                .undefined

        DataManager.count()
            .should
            .equal(1)
    })

    it('should remove meal', function() {

        DataManager.clear()

        var meal = {
            text: 'meal 1',
            amount: 400,
            date: +new Date()
        }

        DataManager.add(meal)

        DataManager.count()
            .should
            .equal(1)

        DataManager.remove(meal)
            .should.equal(true)

        DataManager.count()
            .should
            .equal(0)

        should(DataManager.remove(meal))
            .be
            .undefined
    })

    it('.remove should return undefined if no meal found', function() {

        DataManager.clear()

        var meal = {
            text: 'breakfast',
            amount: 500,
            date: +new Date()
        }

        DataManager.add(meal)

        should(DataManager.remove('aaa'))
            .be
            .undefined

        DataManager.remove(meal.id)
            .should
            .be
            .true
    })

    it('.update should update meal and refresh', function() {

        var meal = {
            text: 'dinner'
        }

        DataManager.add(meal)

        var refreshed = false

        DataManager.on('refresh', function(){
            refreshed = true
        })

        DataManager.update(meal.id, {
            text: 'lunch'
        })
        .should
        .be.true

        meal.text
            .should
            .equal('lunch')


        refreshed
            .should
            .be.true
    })

    it('.clear should remove all meals', function() {

        DataManager.add({})
        DataManager.add({})

        DataManager.count()
            .should
            .equal(2)

        DataManager.clear()
            .should
            .be.true

        DataManager.count()
            .should
            .equal(0)

        should(DataManager.clear())
            .be.undefined
    })

    it('should handle configs', function() {

        DataManager.set('maxPerDay', 50)

        DataManager.get('maxPerDay')
            .should
            .equal(50)
    })
})