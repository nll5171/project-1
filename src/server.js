const http = require('http');
// querystring module for parsing querystrings from url
const query = require('querystring');
// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// struct that removes the need for lots of switch statements
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/getPokemonNames': jsonHandler.getPokemonNames,
  '/getPokemon': jsonHandler.getPokemon,
  '/getPokemonByNumber': jsonHandler.getPokemonByNumber,
  '/getAllPokemon': jsonHandler.getAllPokemon,
  '/addPokemon': jsonHandler.addPokemon,
  '/setPokemonTier': jsonHandler.setPokemonTier,
  notFound: jsonHandler.notFound,
};

// Handle requests that are sent in chunks
const parseBody = (request, response, handler) => {
  const body = [];

  // If anything goes wrong, send badRequest back
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Add chunk to the data until complete
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Combine data into url and add it to request body
  // Call appropriate function for request afterwards
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    handler(request, response);
  });
};

// Handle post request stuff
const handlePost = (request, response, parsedUrl) => {
  parseBody(request, response, urlStruct.parsedUrl);
};

const onRequest = (request, response) => {
  jsonHandler.processDatabase();

  // parse url into individual parts
  // returns an object of url parts by name
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (request.method === 'POST') return handlePost(request, response, parsedUrl);

  if (urlStruct[parsedUrl.pathname]) {
    return urlStruct[parsedUrl.pathname](request, response, parsedUrl.searchParams);
  } return urlStruct.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
