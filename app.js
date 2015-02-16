"use strict";
const Hapi = require('hapi');
const PORT = process.env.port || 8080;
const REDIS_HOST = process.env.REDIS_HOST || "0.0.0.0";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_KEY = process.env.REDIS_KEY ||  "";
const server = new Hapi.Server({
  cache: {
    engine: require('catbox-redis'),
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_KEY
  }
});

server.connection({
  port: PORT
});

require('./routes/routes')(server,{
  index:require('./methods/methods').index,
  pokedex:require('./methods/methods').pokedex(server)
});

server.start(function () {
    console.log(`Server running at: ${server.info.uri}`);
    console.log(`Redis cache at ${REDIS_HOST}:${REDIS_PORT}`);
})