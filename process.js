'use strict';

const firstEntity = (entities, entity) => {
    const val = entities && entities[entity] && Array.isArray(entities[entity]) &&
        entities[entity].length > 0 && entities[entity][0];
    console.log("in first entity value");
    if (!val) {
        return null;
    }
    return val;
}

const processText = (sender_psid, received_message) => {
        let response;

        return wit.message(received_message.text).then(({entities}) => {
            const intent = firstEntity(entities, 'intent');
            const pizza = firstEntity(entities, 'pizza_type');
            if (pizza)
            {
              response = {"text":  `Ok we will order your ${pizza.value} pizza`};
            } else {
              response = {"text":  `We have received your message: ${received_message.text}`};
            }
            callSendAPI(sender_psid, response);
        })
}

const processAttachments = (sender_psid, received_message) => {
        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        let response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url":attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
        callSendAPI(sender_psid, response);
}

module.exports = {
    processAttachments: processAttachments,
    processText: processText
}
