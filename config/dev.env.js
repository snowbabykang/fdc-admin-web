'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const config = require('./index')

module.exports = merge(prodEnv, {
  	NODE_ENV: '"development"',
  	HOST: '"http://localhost:'+config.dev.port+'"',
  	API_HOST : '"http://39.105.28.161:8001"',
})
