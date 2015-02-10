"use strict";
const Hapi = require('hapi');
const Wreck = require('wreck');
const server = new Hapi.Server();
const baseURI    = 'http://pokeapi.co/api/v1/';
const SECOND = 1000;
const PORT = process.env.port || 8080;

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
    expiresIn: 10 * SECOND
  }
})

server.route({
  path:'/',
  method:'GET',
  handler: index
});

server.route({
  path:'/pokedex',
  method:'GET',
  handler: pokedex
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
})