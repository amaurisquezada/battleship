require('dotenv').config()
const express = require('express')
const debug = require('debug')('app:server')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')
const project = require('../config/project.config')
const compress = require('compression')
const bodyParser = require('body-parser')
const pg = require('pg')
const app = express()

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
const config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  host: '127.0.0.1', // Server hosting the postgres database
  port: process.env.PGPORT,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

// this initializes a connection pool
// it will keep idle connections open for a 30 seconds
// and set a limit of maximum 10 idle clients
const pool = new pg.Pool(config)

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool

pool.on('error', (err, client) => {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})

// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/bp_db';

// const client = new pg.Client(connectionString);
// client.connect((err) => {
//   if(err) throw err
// });
// const query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', () => { client.end(); });

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement universal
// rendering, you'll want to remove this middleware.
app.use(require('connect-history-api-fallback')())

// Apply gzip compression
app.use(compress())

// Apply Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig)

  debug('Enabling webpack dev and HMR middleware')
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : project.paths.client(),
    hot         : true,
    quiet       : project.compiler_quiet,
    noInfo      : project.compiler_quiet,
    lazy        : false,
    stats       : project.compiler_stats
  }))
  app.use(require('webpack-hot-middleware')(compiler))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(project.paths.public()))
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(project.paths.dist()))
}

app.get('/api/users/:id', (req, res, next) => {
  const id = req.params.id
  pool.connect((err, client, done) => {
    if (err) {
      throw err
    }
    client.query('SELECT * FROM users WHERE id=' + id, (err, result) => {
      done()
      if (err) throw err
      res.send(result.rows[0])
    })
  })
})

app.get('/api/users', (req, res, next) => {
  pool.connect((err, client, done) => {
    if (err) {
      throw err
    }
    client.query('SELECT * FROM users', (err, result) => {
      done()
      if (err) throw err
      const final = result.rows.sort((a, b) => a.id - b.id)
      res.send(final)
    })
  })
})

app.patch('/api/users/:id', (req, res, next) => {
  const userId = req.params.id
  const field = Object.keys(req.body)[0]
  const value = req.body[field]
  pool.connect((err, client, done) => {
    if (err) {
      throw err
    }
    client.query(`UPDATE users SET ${field} = '${value}' WHERE id = ${userId} RETURNING *`, (err, result) => {
      done()
      if (err) throw err
      res.send(result.rows[0])
    })
  })
})

module.exports = app
