module.exports = function(server,handlers){
  server.route({
    path:'/',
    method:'GET',
    handler: handlers.index
  });

  server.route({
    path:'/pokedex',
    method:'GET',
    config:{
      handler: handlers.pokedex,
      cors: {
        origin: [
        'http://localhost:3000',
        'http://pokemon-react-staging.azurewebsites.net'
        ],
        methods:['GET']
      }
    }
  });
}