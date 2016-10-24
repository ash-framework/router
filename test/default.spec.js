/* global describe, it, beforeEach */
const assert = require('assert')
const path = require('path')
const express = require('express')
const request = require('supertest-as-promised')
const bodyparser = require('body-parser')
const router = require('../src')
let app

describe('Router', function () {
  beforeEach(() => {
    app = express()
    app.use(bodyparser.json())
  })

  it('should render a route', function () {
    const definition = function () {
      this.route('users', function () {
        this.route('list')
      })
      this.route('user', { path: '/user/:user_id' })
    }

    const expressRouter = router(definition, {routesDir: path.join(__dirname, 'routes-1')})
    app.use(expressRouter)

    return Promise.all([
      request(app).get('/'),
      request(app).get('/users'),
      request(app).get('/users/list'),
      request(app).get('/user/12')
    ])
    .then(res => {
      assert.deepEqual(res[0].body, {})
      assert.deepEqual(res[1].body, {})
      assert.deepEqual(res[2].body, { name: 'bob', lastName: 'Jones' })
      assert.strictEqual(res[3].text, '12')
    })
  })

  it('should render a route with no index route files provided', function () {
    const definition = function () {
      this.route('animals', {path: '/beasts'}, function () {
        this.route('cats', {path: '/meowers'}, function () {
          this.route('fluffy', {path: '/:cat_id'})
        })
      })
    }

    const expressRouter = router(definition, {routesDir: path.join(__dirname, 'routes-2')})
    app.use(expressRouter)

    return Promise.all([
      request(app).get('/').expect(404),
      request(app).get('/beasts').expect(404),
      request(app).get('/beasts/meowers').expect(404),
      request(app).get('/beasts/meowers/121')
    ])
    .then(res => {
      assert.deepEqual(res[3].body, {name: 'fluffy', id: '121'})
    })
  })

  it('http context', function () {
    const definition = function () {
      this.route('houses')
    }

    const expressRouter = router(definition, {routesDir: path.join(__dirname, 'routes-3')})
    app.use(expressRouter)

    return request(app).get('/houses').expect(200)
      .then(res => {
        assert.deepEqual(res.body, {one: 'one', two: 'two'})
      })
  })

  it('serialize', function () {
    const definition = function () {
      this.route('colours')
    }

    const expressRouter = router(definition, {routesDir: path.join(__dirname, 'routes-4')})
    app.use(expressRouter)

    return request(app).get('/colours').expect(200)
      .then(res => {
        assert.deepEqual(res.body, {colour: 'blue', serialized: true})
      })
  })

  it('deserialize', function () {
    const definition = function () {
      this.route('shapes', {method: 'post'})
    }

    const expressRouter = router(definition, {routesDir: path.join(__dirname, 'routes-5')})
    app.use(expressRouter)

    return request(app).post('/shapes')
      .send({name: 'triangle'})
      .expect(200)
      .then(res => {
        assert.deepEqual(res.body, {name: 'triangle', sides: 3})
      })
  })
})
