const fs = require('fs'); // pull in the file system module

const database = fs.readFileSync(`${__dirname}/../datasets/pokedex.json`);

// JavaScript object to store all Pokedex data
let pokedex;

const processDatabase = () => {
  pokedex = JSON.parse(database);
};

// Takes request, responds with status code and json object
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  // Send response
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body, just metadata
  if (request.method !== 'HEAD' && status !== 204) response.write(content);

  response.end();
};

// Same as getPokemon, but only returns the names as a response
const getPokemonNames = (request, response, params) => {
  const pokemonNames = [];
  let name;
  let id;
  let types;

  if (params.get('name')) name = params.get('name');
  if (params.get('id') && Number(params.get('id')) != NaN) 
    id = Number(params.get('id'));
  if (params.get('types')) types = params.get('types').split(',');

  for (let i = 0; i < pokedex.length; i++) {
    let currentPokemon = pokedex[i];

    if (name && currentPokemon.name === name)
      pokemonNames.push(currentPokemon.name);

    else if (id && Number(currentPokemon,num) === id)
      pokemonNames.push(currentPokemon.name);

    else if (types) {
      let actualTypes = currentPokemon.type;

      for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < actualTypes.length; j++) {
          if (types[i] === types[j]) {
            pokemonNames.push(currentPokemon.name);
            break;
          }
        }
      }
    }
  }

  const responseJSON = {
    pokemonNames,
  };

  respondJSON(request, response, 200, responseJSON);
};

// Gets all information about each pokemon matching the parameters,
// returns said data as a response
const getPokemon = (request, response, params) => {
  const pokemon = [];
  let name;
  let id;
  let types;

  if (params.get('name')) name = params.get('name');
  if (params.get('id') && Number(params.get('id')) != NaN) 
    id = Number(params.get('id'));
  if (params.get('types')) types = params.get('types').split(',');

  for (let i = 0; i < pokedex.length; i++) {
    let currentPokemon = pokedex[i];

    if (name && currentPokemon.name === name)
      pokemon.push(currentPokemon);

    else if (id && Number(currentPokemon,num) === id)
      pokemon.push(currentPokemon);

    else if (types) {
      let actualTypes = currentPokemon.type;

      for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < actualTypes.length; j++) {
          if (types[i] === types[j]) {
            pokemon.push(currentPokemon);
            break;
          }
        }
      }
    }
  }

  const responseJSON = {
    pokemonNames,
  };

  respondJSON(request, response, 200, responseJSON);
};

// Gets one Pokemon by their Pokedex number
const getPokemonByNumber = (request, response, params) => {
  // Make sure id was provided, return 400 error otherwise
  if (!params.get('id')) {
    const responseJSON = {
      error: 'Missing Pokedex number query param',
      id: 'getPokemonByNumber missing param'
    };

    respondJSON(request, response, 400, responseJSON);
  }

  // id was provided. Need to check if valid next 
  else {
    let id = Number(params.get('id'));

    // Check if id entered is valid. Return 400 error if not
    if (id < 1 || id > 151) {
      const responseJSON = {
        error: 'Invalid id provided. Enter number between 1 and 151',
        id: 'getPokemonByNumber invalid id'
      };

      respondJSON(request, response, 400, responseJSON);
    }

    // id exists and is valid
    else {
      let pokemon = pokedex[id - 1];

      const responseJSON = {
        pokemon,
      };

      respondJSON(request, response, 200, responseJSON);
    }
  }
};

// Does not need parameters, just has them to reduce code in server.json
const getAllPokemon = (request, response, params) => {
  const responseJSON = {
    pokedex,
  };

  respondJSON(request, response, 200, responseJSON);
};

const addPokemon = (request, response, params) => {
  
};

// Page doesn't exist, returns 404
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for was not found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  processDatabase,
  getPokemonNames,
  getPokemon,
  getPokemonByNumber,
  getAllPokemon,
  notFound,
};
