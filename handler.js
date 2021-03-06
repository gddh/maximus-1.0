'use strict';

const
    Config = require('./config'),
    request = require('request');

// Sends response messages via the SEND API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    // console.log("response in callSendAPI: ", response);
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    //console.log("response ", response);
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": Config.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = {
    callSendAPI : callSendAPI
}
