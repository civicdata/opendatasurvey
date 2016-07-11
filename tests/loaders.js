'use strict'

const assert = require('chai').assert
const censusConfig = require('../census/config')
const siteID = 'site1'
const REGISTRY_URL = 'https://docs.google.com/spreadsheets/d/1FK5dzeNeJl81oB76n' +
  'WzhS1dAdnXDoZbbe_vTH4NlThM/edit#gid=0'
const testUtils = require('./utils')
const userFixtures = require('../fixtures/user')

describe('Admin page', function () {
  this.timeout(20000)

  before(testUtils.startApplication)
  after(testUtils.shutdownApplication)

  const configValues = {
    registryUrl: censusConfig.get('registryUrl')
  }

  after(function () {
    for (var setting in configValues) {
      censusConfig.set(setting, configValues[setting])
    }
  })

  before(function () {
    let config = testUtils.app.get('config')
    config.set('test:testing', true)
    config.set('test:user', {
      userid: userFixtures[0].data.id,
      emails: userFixtures[0].data.emails
    })
    config.set('registryUrl', REGISTRY_URL)
    this.browser = testUtils.browser
    this.app = testUtils.app
  })

  beforeEach(function () {
    return this.browser.visit('/admin')
  })

  it('should load admin page successfully', function () {
    this.browser.assert.success()
    this.browser.assert.text('title', 'Dashboard -')
  })

  describe('reload config button action', function () {
    beforeEach(function () {
      return this.browser.pressButton('Reload Config')
    })

    it('should load config', function () {
      this.browser.assert.success()
      let html = this.browser.resources[0].response.body
      let jsonData = JSON.parse(html)
      assert.equal(jsonData.status, 'ok')
      assert.equal(jsonData.message, 'ok')
      return this.app.get('models').Site.findById(siteID).then(function (data) {
        assert.isNotNull(data)
        assert.notEqual(data.places, '')
        assert.notEqual(data.places, '')
        assert.notEqual(data.datasets, '')
        assert.notEqual(data.questions, '')
      })
    })
  })

  describe('reload places button action', function () {
    beforeEach(function () {
      return this.browser.pressButton('Reload Places')
    })

    it('should load places', function () {
      this.browser.assert.success()
      let html = this.browser.resources[0].response.body
      let jsonData = JSON.parse(html)
      assert.equal(jsonData.status, 'ok')
      assert.equal(jsonData.message, 'ok')
      return this.app.get('models').Place.findAll({where: {site: siteID}})
        .then(function (data) {
          assert.equal(data.length, 3)
        })
    })
  })

  describe('reload datasets button action', function () {
    beforeEach(function () {
      return this.browser.pressButton('Reload Datasets')
    })

    it('should load datasets', function () {
      this.browser.assert.success()
      let html = this.browser.resources[0].response.body
      let jsonData = JSON.parse(html)
      assert.equal(jsonData.status, 'ok')
      assert.equal(jsonData.message, 'ok')
      return this.app.get('models').Dataset.findAll({where: {site: siteID}})
        .then(function (data) {
          assert.equal(data.length, 15)
        })
    })
  })

  describe('reload questions button action', function () {
    beforeEach(function () {
      return this.browser.pressButton('Reload Questions')
    })

    it('should load questions', function () {
      this.browser.assert.success()
      let html = this.browser.resources[0].response.body
      let jsonData = JSON.parse(html)
      assert.equal(jsonData.status, 'ok')
      assert.equal(jsonData.message, 'ok')
      return this.app.get('models').Question.findAll({where: {site: siteID}})
        .then(function (data) {
          assert.equal(data.length, 18)
        })
    })
  })
})
