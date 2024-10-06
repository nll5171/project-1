const fs = require('fs'); // pull in the file system module

const database = fs.readFileSync(`${__dirname}/../datasets/pokedex.json`);

// JavaScript object to store all Pokedex data
let pokedex;

const processDatabase = () => {
  pokedex = JSON.parse(database);
  console.log(pokedex[1]);
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

// Returns the list of users as a JSON object
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Adds new user if they don't exist, updates age otherwise
const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // Get name and age into object from request body
  const { name, age } = request.body;

  // Make sure we have both fields, else it's a bad request
  if (!name || !age) {
    response.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // If params exist, assume updating user by default
  let responseCode = 204;

  // If user doesn't yet exist, add user with 201 for created
  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  users[name].age = age;

  // Send back message that user was created
  if (responseCode === 201) {
    responseJSON.message = 'Created successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // 204 shouldn't include response body. Sending back empty one
  return respondJSON(request, response, responseCode, {});
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
  getUsers,
  addUser,
  notFound,
};
