const Wreck = require('wreck');
const baseURI    = 'http://pokeapi.co/api/v1/';
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR =  60 * MINUTE;
const DAY = 24 * HOUR;

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

exports.index = function index(request,reply){
  Wreck.get(baseURI,null,function(err,response,payload){
    reply( err || JSON.parse(payload));
  });
};

exports.pokedex = function(server){
  server.method('getPokedex',getPokedex,{
    cache: {
      expiresIn: DAY,
      staleIn: (12 * HOUR),
      staleTimeout: 100
    }
  });

  return function pokedex(request,reply){
    server.methods.getPokedex(function(err, result) {
     reply(err || result);
    });
  };
}
