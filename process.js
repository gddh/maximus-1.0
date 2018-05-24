'use strict';

var wit = require('./services/wit').getWit();
var Handler = require('./handler');

const firstEntity = (entities, entity) => {
    const val = entities && entities[entity] && Array.isArray(entities[entity]) &&
        entities[entity].length > 0 && entities[entity][0];
    console.log("in first entity value");
    if (!val) {
        return null;
    }
    return val;
}

const reminderFunction = (sender_psid, repeat_info) => {
    let response;

    response = {"text": `This is your reminder. Flag ${repeat_info[1]}`};
    Handler.callSendAPI(sender_psid, response);
    if (repeat_info[1] == 1)
    {
        console.log(`repeat_info is ${repeat_info[1]}`);
        setTimeout(reminderFunction, repeat_info[2], sender_psid, repeat_info);
    }
}

const repeatInterval = (remind_keyword, time_interval) => {
    switch(remind_keyword) {
        case 'daily':
            return [time_interval, 1, 24 * 3600 * 1000];
        case 'hourly':
            return [time_interval, 1, 3600 * 1000];
        case 'once':
            return [time_interval, 0];
    }
}

const calcInterval = (datetime) => {
    console.log('datetime.value is');
    console.log(datetime.value);
    let etime = new Date(datetime.value);
    let e_hr = etime.getHours();
    let e_min = etime.getMinutes();
    let e_sec = etime.getSeconds(); 
    let curtime = new Date();
    let cur_hr = curtime.getHours();
    let cur_min = curtime.getMinutes();
    let cur_sec = curtime.getSeconds();
    let interval = ((e_hr - cur_hr) * 3600 + (e_min - cur_min) * 60 + (e_sec - cur_sec)) * 1000;
    return interval;
}

const processText = (sender_psid, received_message) => {
        let response;
        let intent_val;
        let repeat_info;

        return wit.message(received_message.text).then(({entities}) => {
            console.log(`Entities`);
            console.log(entities);
            const intent = firstEntity(entities, 'intent');
            const pizza = firstEntity(entities, 'pizza_type');
            const remind = firstEntity(entities, 'remind_me');
            const datetime = firstEntity(entities, 'datetime');
            if (intent)
                intent_val = firstEntity(entities, 'intent').value;
            let flag = 1;
            if (pizza) {
                response = {"text":  `Ok we will order your ${pizza.value} pizza`};
            } else if (intent && intent_val == 'reminder') {
                if (remind) {
                    if (!datetime) {
                        response = {"text": `Could you please repeat the message with a specific time?`};
                    } else {
                        let interval = calcInterval(datetime); 
                        if (interval < 0)
                        {
                            response =  {"text": `I cannot remind you because the time has passed`};
                        } else {
                            //console.log('remind is');
                            //console.log(remind);
                            repeat_info = repeatInterval(remind.value, interval);
                            setTimeout(reminderFunction, repeat_info[0], sender_psid, repeat_info);
                            response = {"text": `Ok we will remind you ${remind.value}`};
                        }
                    }
           } else {
                    response = {"text": `Ok we will remind you in 5 seconds`};
                    setTimeout(reminderFunction, 5000, sender_psid, flag, 5000);
                }
            } else {
                response = {"text":  `We have received your message: ${received_message.text}`};
            }
            Handler.callSendAPI(sender_psid, response);
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
        Handler.callSendAPI(sender_psid, response);
        return response;
}

module.exports = {
    processAttachments: processAttachments,
    processText: processText
}
