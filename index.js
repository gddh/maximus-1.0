'use strict';

var Config      = require('./config');
var Process     = require('./process');
var Handler     = require('./handler');
var Lib         = require('./library_response');
var Response    = require('./response');
var Data        = require('./data');

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
  let body = req.body;
  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message && webhook_event.message.quick_reply) {
            handleQuickReply(sender_psid, webhook_event.message);
        } else if (webhook_event.message) {
        //console.log("webhook ", webhook_event);
        //if (webhook_event.message){
            handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
    });
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  //let VERIFY_TOKEN = "<test>"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === Config.VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
    // Check if the message contains text
    if (received_message.text) {
        Process.processText(sender_psid, received_message);
    } else if (received_message.attachments) {
        Process.processAttachments(sender_psid, received_message);
    }
}

function handleQuickReply(sender_psid, received_message) {
    let payload = received_message.quick_reply.payload;
    let response;
    if (payload === 'yes') {
        response = { "text": "Awesome! Let's do it."}
    } else if (payload === 'no') {
        response = { "text": "Oh no, what is wrong? Is there any way I can help?"}
    } else if (Data.hasTask(sender_psid, payload.substr(1))
                || Data.hasReminder(sender_psid, payload.substr(1))) {
        let flag = payload[0];
        payload = payload.substr(1);
        if (flag == 1) {
            Data.markTaskAs('completed', sender_psid, payload);
            response = Response.getResponse('completed task1', Data.getName(sender_psid), 0);
        } else if (flag == 0) {
            Data.clearTask(sender_psid, payload);
            response = {"text": "Understood. I have removed the task."};
        } else if (flag == 2) {
            Data.removeReminder(sender_psid, payload);
            response = {"text": "Understood. I have removed the reminder."};
        }
    } else {
        let duration_response = {"text": "You've completed your challenge!!! Congrats!"};
        setTimeout(Handler.callSendAPI, parseInt(payload), sender_psid, duration_response);
    }
    Handler.callSendAPI(sender_psid, response);

}

function handlePostback(sender_psid, received_postback) {
    let response;
    let payload = received_postback.payload;

    if (payload === 'yes') {
        response = { "text": "Awesome! Let's do it."}
    } else if (payload === 'no') {
        response = { "text": "Oh no, what is wrong? Is there any way I can help?"}
    }
    Handler.callSendAPI(sender_psid, response);
}
