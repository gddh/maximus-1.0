'use strict';

var wit = require('./services/wit').getWit();
var Handler = require('./handler');
var Interval = require('./interval')
var Helper = require('./helper')
var Response = require('./response')
var Emoji = require('./emoji/response/emoji_response.js')

const id_to_name = {};
const name_to_id = {};

const reminderFunction = (target_psid, repeat_info) => {
    let response = Response.getResponse(repeat_info[3], repeat_info[2], repeat_info[5]);
    if (id_to_name[target_psid].reminders.includes(repeat_info[3])) {
        console.log(`sending ${response}`);
        Handler.callSendAPI(target_psid, response);
    } else {
        repeat_info[1] = 0;
    }
    if (repeat_info[1] == 1) {
        setTimeout(reminderFunction, repeat_info[4], target_psid, repeat_info);
    }
}

const createPerson = (sender_id) => {
    let personID;

    Object.keys(id_to_name).forEach(k => {
        if (k == sender_id) {
            personID = sender_id;
        }
    });
    if (!personID) {
        personID = sender_id;
        id_to_name[personID] = {name : null, reminders : []};
    }
}

const processIntro = (name, sender_psid) => {
    let response;
    if (name) {
        if (!(name.value in name_to_id)) {
            id_to_name[sender_psid].name = name.value;
            name_to_id[name.value] = sender_psid;
            response = {"text": `Nice to meet you ${name.value}! How are you doing today?`}
        } else {
            response = {"text": `I think that name is already taken...`}
        }
    } else {
        response = {"text": `Hi! I am Maximus, what is your name?`};
    }
    return response;
}

const processCancel = (name, sequence) => {
    let target_psid = name_to_id[name.value];
    let index = id_to_name[target_psid].reminders.indexOf(sequence.value);
    if (index > -1) {
        id_to_name[target_psid].reminders.splice(index, 1);
    }
}

const processText = (sender_psid, received_message) => {
        let response;
        let intent_val;

        return wit.message(received_message.text).then(({entities}) => {
            createPerson(sender_psid);
            const name = Helper.firstEntity(entities, 'name');
            const cancel = Helper.firstEntity(entities, 'cancel');
            const sequence = Helper.firstEntity(entities, 'sequence');
            const intent = Helper.firstEntity(entities, 'intent');
            const pizza = Helper.firstEntity(entities, 'pizza_type');
            const datetime = Helper.firstEntity(entities, 'datetime');
            if (intent)
                intent_val = Helper.firstEntity(entities, 'intent').value;
            if (id_to_name[sender_psid].name == null) {
                response = processIntro(name, sender_psid);
            } else if (pizza) {
                response = {"text":  `Ok we will order your ${pizza.value} pizza`};
            } else if (intent && intent_val == 'cancel' && cancel) {
                processCancel(name, sequence);
            } else if (intent && intent_val == 'reminder') {
                response = processReminder(sequence, name, entities, datetime, sender_psid)
            } else {
                response = Emoji.emojiReply([received_message.text]).then(function (value) { return value });
            }
            Handler.callSendAPI(sender_psid, response);
        })
}

const processReminder = (sequence, name, entities, datetime, sender_psid) => {
    const remind = Helper.firstEntity(entities, 'remind_me');
    const duration = Helper.getDuration(entities);
    let response;
    if (remind) {
        if (!datetime) {
            response = {"text": `Could you please repeat the message with a specific time?`};
        } else {
            let interval = Interval.calcInterval(datetime); 
            if (interval < 0) {
                response = {"text": `I cannot remind you because the time has passed`};
            } else {
                if (sequence != null && (!name || name_to_id["GDDH"] == sender_psid || id_to_name[sender_psid].name == name.value))
                {
                    let repeat_info;
                    if (name_to_id["GDDH"] == sender_psid && name && name.value != 'me') {
                        repeat_info = Interval.repeatInterval(remind.value, sequence.value, interval, name.value, duration);
                        id_to_name[name_to_id[name.value]].reminders.push(sequence.value);
                        setTimeout(reminderFunction, repeat_info[0], name_to_id[name.value], repeat_info);
                    } else {
                        repeat_info = Interval.repeatInterval(remind.value, sequence.value, interval,
                                                                id_to_name[sender_psid].name, duration);
                        id_to_name[sender_psid].reminders.push(sequence.value);
                        setTimeout(reminderFunction, repeat_info[0], sender_psid, repeat_info);
                    }
                    response = {"text": `Ok we will remind you ${remind.value}`};
                }
            }
        }
    } else {
        response = {"text": `Ok we will remind you in 5 seconds`};
        setTimeout(reminderFunction, 5000, sender_psid, 1, 5000);
    }
    return response;
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
