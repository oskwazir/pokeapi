"use strict";
const Hapi = require('hapi');
const Wreck = require('wreck');
const baseURI    = 'http://pokeapi.co/api/v1/';
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR =  60 * MINUTE;
const DAY = 24 * HOUR;
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

const index = function index(request,reply){
  Wreck.get(baseURI,null,function(err,response,payload){
    reply( err || JSON.parse(payload));
  });
};

const pokedex = function pokedex(request,reply){
  server.methods.getPokedex(function(err, result) {
   reply(err || result);
  });
};

const getPokedex = function (next){
  console.log('Getting pokedex data');
  Wreck.get(`${baseURI}pokedex/1/`,null,function(err,response,payload){
    if (err){
      next(err);
    } else {
      next(null, JSON.parse(payload));
    }
  });
}

server.connection({
  port: PORT
});

server.method('getPokedex',getPokedex,{
  cache: {
    expiresIn: DAY,
    staleIn: HOUR,
    staleTimeout: 200
  }
});

server.route({
  path:'/',
  method:'GET',
  handler: index
});

server.route({
  path:'/pokedex',
  method:'GET',
  config:{
    handler: pokedex,
    cors: {
      origin: ['http://localhost:3000','http://pokemon-react-*.azurewebsites.net'],
      methods:['GET']
    }
  }
  
});

server.start(function () {
    console.log(`Server running at: ${server.info.uri}`);
    console.log(`Redis cache at ${REDIS_HOST}:${REDIS_PORT}`);
})