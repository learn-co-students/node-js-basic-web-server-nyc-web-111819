"use strict";
const bcrypt = require('bcryptjs');
const http = require('http');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const finalhandler = require('finalhandler');
const Router = require('router');
const router = new Router();
router.use(bodyParser.json());

let messages = [];
let nextId = 1;

class Message {
  constructor(message) {
    this.id = nextId;
    this.message = message;
    nextId++;
  }
}

router.get('/', (request, response) => {


  response.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // console.log(response.body) 
  response.end("Hello, World!");
});
router.get('/messages', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(messages))
})
router.get('/message/:id', (request, response) => {
  let msg = messages.find(message => message.id === parseInt(request.params.id))
  if (msg) {
    response.statusCode = 200
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(msg))
  } else {
    response.statusCode = 400
    response.end("Message not found")
  }
})

router.post('/message', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  // console.log(request.body)
  let newMsg = new Message(request.body.message)

  messages.unshift(newMsg)

  response.end(JSON.stringify(newMsg.id))
})

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function (port, callback) {
  server.listen(port, callback);
};

exports.close = function (callback) {
  server.close(callback);
};
