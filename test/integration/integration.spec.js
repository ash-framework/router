/* global describe, it, beforeEach */
const assert = require('assert')
const path = require('path')
const express = require('express')
const request = require('supertest-as-promised')
const bodyparser = require('body-parser')
const router = require('../../src')
let app

describe('Router', function () {
  beforeEach(() => {
    app = express()
    app.use(bodyparser.json())
  })

  it('should render a route setup in the ember way', function () {
    const definition = function () {
      this.route('animals', function () {
        this.route('dogs')
        this.route('cats')
        this.route('mice')
      })
    }

    const expressRouter = router(definition, {
      routesDir: path.join(__dirname, 'routes-2')
    })
    app.use(expressRouter)

    return Promise.all([
      request(app).get('/animals/dogs'),
      request(app).get('/animals/cats'),
      request(app).get('/animals/mice')
    ])
    .then(res => {
      assert.deepEqual(res[0].body.name, 'dogs')
      assert.deepEqual(res[1].body.name, 'cats')
      assert.deepEqual(res[2].body.name, 'mice')
    })
  })

  it('should render a crud type route setup', function () {
    const definition = function () {
      this.route('widgets', function () {
        // implicit index - /widgets
        this.route('widget', {path: '/:widget_id'})
      })
    }

    const expressRouter = router(definition, {
      routesDir: path.join(__dirname, 'routes-1')
    })
    app.use(expressRouter)

    return Promise.all([
      request(app).get('/widgets'),
      request(app).post('/widgets'),
      request(app).get('/widgets/1'),
      request(app).put('/widgets/1'),
      request(app).delete('/widgets/1')
    ])
    .then(res => {
      assert.deepEqual(res[0].body.method, 'get')
      assert.deepEqual(res[0].body.name, 'index')

      assert.deepEqual(res[1].body.method, 'post')
      assert.deepEqual(res[1].body.name, 'index')

      assert.deepEqual(res[2].body.method, 'get')
      assert.deepEqual(res[2].body.name, 'widget')
      assert.deepEqual(res[2].body.id, 1)

      assert.deepEqual(res[3].body.method, 'put')
      assert.deepEqual(res[3].body.name, 'widget')
      assert.deepEqual(res[3].body.id, 1)

      assert.deepEqual(res[4].body.method, 'delete')
      assert.deepEqual(res[4].body.name, 'widget')
      assert.deepEqual(res[4].body.id, 1)
    })
  })

  it('should render a complex nested crud type route setup', function () {
    const definition = function () {
      this.route('users', function () {
        // explicit index with custom name - /users
        // this is the same as either
        // this.route('index')
        // or omitting completely
        this.route('users', {path: '/'})

        this.route('user', {path: '/:user_id'}, function () {
          this.route('user', {path: '/'})  // explicit index with custom name - /users/1
          this.route('widgets', {path: '/widgets'}, function () {
            this.route('widgets', {path: '/'})  // explicit index with custom name - users/1/widgets
            this.route('widget', {path: '/:widget_id'})  // users/1/widgets/2
          })
        })
      })
    }

    const expressRouter = router(definition, {
      routesDir: path.join(__dirname, 'routes-3')
    })
    app.use(expressRouter)

    return Promise.all([
      request(app).get('/users'),
      request(app).post('/users'),
      request(app).get('/users/:user_id'),
      request(app).put('/users/:user_id'),
      request(app).delete('/users/:user_id'),
      request(app).get('/users/:user_id/widgets'),
      request(app).post('/users/:user_id/widgets'),
      request(app).get('/users/:user_id/widgets/:widget_id'),
      request(app).put('/users/:user_id/widgets/:widget_id'),
      request(app).delete('/users/:user_id/widgets/:widget_id')
    ])
    .then(res => {
      assert.deepEqual(res[0].body.method, 'get')
      assert.deepEqual(res[0].body.name, 'users')

      assert.deepEqual(res[1].body.method, 'post')
      assert.deepEqual(res[1].body.name, 'users')

      assert.deepEqual(res[2].body.method, 'get')
      assert.deepEqual(res[2].body.name, 'user')

      assert.deepEqual(res[3].body.method, 'put')
      assert.deepEqual(res[3].body.name, 'user')

      assert.deepEqual(res[4].body.method, 'delete')
      assert.deepEqual(res[4].body.name, 'user')

      assert.deepEqual(res[5].body.method, 'get')
      assert.deepEqual(res[5].body.name, 'widgets')

      assert.deepEqual(res[6].body.method, 'post')
      assert.deepEqual(res[6].body.name, 'widgets')

      assert.deepEqual(res[7].body.method, 'get')
      assert.deepEqual(res[7].body.name, 'widget')

      assert.deepEqual(res[8].body.method, 'put')
      assert.deepEqual(res[8].body.name, 'widget')

      assert.deepEqual(res[9].body.method, 'delete')
      assert.deepEqual(res[9].body.name, 'widget')
    })
  })

  it('route priority', function () {
    const definition = function () {
      this.route('users', function () {
        this.route('users', {path: '/'})
      })
    }

    const expressRouter = router(definition, {
      routesDir: path.join(__dirname, 'routes-4')
    })
    app.use(expressRouter)

    return Promise.all([
      request(app).get('/users')
    ])
    .then(res => {
      assert.deepEqual(res[0].body.method, 'get')
      assert.deepEqual(res[0].body.name, 'users')
    })
  })

  it('index works for empty route with callback', function () {
    const definition = function () {
      this.route('users', function () { })
    }

    const expressRouter = router(definition, {
      routesDir: path.join(__dirname, 'routes-5')
    })
    app.use(expressRouter)

    return Promise.all([
      request(app).get('/users')
    ])
    .then(res => {
      assert.deepEqual(res[0].body.method, 'get')
      assert.deepEqual(res[0].body.name, 'index')
    })
  })
})
