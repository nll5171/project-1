const fs = require('fs'); // pull in the file system module

const database = fs.readFileSync(`${__dirname}/../datasets/pokedex.json`);

// JavaScript object to store all Pokedex data
const pokedex = {};

const processDatabase = () => {
  const pokedexArr = JSON.parse(database);

  for (let i = 0; i < pokedexArr.length; i++) {
    pokedex[pokedexArr[i].id] = pokedexArr[i];
  }
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

// Gets all information about each pokemon matching the parameters,
// returns said data as a response
const getPokemonNames = (request, response, params) => {
  // Stores all pokemon matching the parameters provided
  const pokemonNames = [];
  let id;
  let name;
  let type;

  if (params.get('id')) id = params.get('id').trim();
  if (params.get('name')) name = params.get('name').trim().toLowerCase();
  if (params.get('type')) type = params.get('type').trim().split(',');

  // Start more broadly with type, then get more specific
  // to name, then id, assuming they exist. If they don't, and
  // pokemon meets any of the types entered, add them
  const pokedexArr = Object.values(pokedex);

  console.log(type);

  for (let a = 0; a < pokedexArr.length; a++) {
    const currentPokemon = pokedexArr[a];

    if (type) {
      // Check if any types in the params match current pokemon
      for (let i = 0; i < type.length; i++) {
        for (let j = 0; j < currentPokemon.type.length; j++) {
          if (type[i].toLowerCase() === currentPokemon.type[j].toLowerCase()) {
            // If id and name were not provided, add currentPokemon to search results
            if (!id || !name) pokemonNames.push(currentPokemon.name);

            // Check if currentPokemon matches the more strict params
            else if (name && name === currentPokemon.name.toLowerCase()) {
              pokemonNames.push(currentPokemon.name);
            } else if (id && id === currentPokemon.id) {
              pokemonNames.push(currentPokemon.name);
            }
          }
        }
      }
    } else if (id || name) {
      if (name && name === currentPokemon.name.toLowerCase()) {
        pokemonNames.push(currentPokemon.name);
      } else if (id && id === currentPokemon.id) {
        pokemonNames.push(currentPokemon.name);
      }
    }
  }

  const responseJSON = {
    pokemonNames,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Gets all information about each pokemon matching the parameters,
// returns said data as a response
const getPokemon = (request, response, params) => {
  // Stores all pokemon matching the parameters provided
  const pokemon = [];
  let id;
  let name;
  let type;

  if (params.get('id')) id = params.get('id').trim();
  if (params.get('name')) name = params.get('name').trim().toLowerCase();
  if (params.get('type')) type = params.get('type').trim().split(',');

  // Start more broadly with type, then get more specific
  // to name, then id, assuming they exist. If they don't, and
  // pokemon meets any of the types entered, add them
  const pokedexArr = Object.values(pokedex);

  for (let a = 0; a < pokedexArr.length; a++) {
    const currentPokemon = pokedexArr[a];

    if (type) {
      // Check if any types in the params match current pokemon
      for (let i = 0; i < type.length; i++) {
        for (let j = 0; j < currentPokemon.type.length; j++) {
          if (type[i].toLowerCase() === currentPokemon.type[j].toLowerCase()) {
          // If id and name were not provided, add currentPokemon to search results
            if (!id || !name) pokemon.push(currentPokemon);

            // Check if currentPokemon matches the more strict params
            else if (name && name === currentPokemon.name.toLowerCase()) {
              pokemon.push(currentPokemon);
            } else if (id === currentPokemon.id) pokemon.push(currentPokemon);
          }
        }
      }
    } else if (id || name) {
      if (name && name === currentPokemon.name.toLowerCase()) {
        pokemon.push(currentPokemon);
      } else if (id && id === currentPokemon.id) pokemon.push(currentPokemon);
    }
  }

  const responseJSON = {
    pokemon,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Gets one Pokemon by their Pokedex number
const getPokemonByNumber = (request, response, params) => {
  // Make sure id was provided, return 400 error otherwise
  if (!params.get('id')) {
    const responseJSON = {
      error: 'Missing Pokedex number query param',
      id: 'getPokemonByNumberMissingParam',
    };

    return respondJSON(request, response, 400, responseJSON);
  }

  // id was provided. Need to check if valid next

  const id = params.get('id');

  // Check if id entered is valid. Return 400 error if not
  if (!pokedex[id]) {
    const responseJSON = {
      error: 'Invalid id provided. No pokemon exists with that ID in the database.',
      id: 'getPokemonByNumberInvalidId',
    };

    return respondJSON(request, response, 400, responseJSON);
  }

  // id exists and is valid
  const pokemon = pokedex[id];

  const responseJSON = {
    pokemon,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Does not need parameters, just has them to reduce code in server.json
const getAllPokemon = (request, response, params) => {
  console.log(params);

  const pokedexArr = Object.values(pokedex);

  const responseJSON = {
    pokedexArr,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// All standard params are included, but only id, name, and type are required
const addPokemon = (request, response) => {
  const responseJSON = {
    message: 'id, name and type (comma separated) are all required',
  };

  // Get all pokedex object data from request body, including optional params
  const {
    id, name, img, type, height, weight, weaknesses, nextEvolution,
  } = request.body;

  if (!id || !name || !type) {
    responseJSON.id = 'addPokemonMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const pokemon = {
    id,
    name,
    img,
    type,
    height,
    weight,
    weaknesses,
    next_evolution: nextEvolution,
  };

  // Will simply update content if it already exists in database
  let responseCode = 204;

  if (!pokedex[id]) {
    responseCode = 201;
    responseJSON.message = 'Created successfully';
    pokedex[id] = pokemon;
    return respondJSON(request, response, responseCode, responseJSON);
  }

  pokedex[id] = pokemon;

  // If updated, don't include any content
  return respondJSON(request, response, responseCode, {});
};

// Tiers being strength rating, from Ubers to PU
const setPokemonTier = (request, response) => {
  const responseJSON = {
    message: 'ID and tier are both required',
  };

  const { id, tier } = request.body;

  if (!id || !tier) {
    responseJSON.id = 'setPokemonTierMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (!pokedex[id]) {
    responseJSON.message = 'ID does not exist within database';
    responseJSON.id = 'setPokemonTierInvalidID';
    return respondJSON(request, response, 400, responseJSON);
  }

  pokedex[id].tier = tier;
  responseJSON.message = 'Tier added!';

  return respondJSON(request, response, 201, responseJSON);
};

// Page doesn't exist, returns 404
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for was not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  processDatabase,
  getPokemonNames,
  getPokemon,
  getPokemonByNumber,
  getAllPokemon,
  addPokemon,
  setPokemonTier,
  notFound,
};
