'use strict';

var wit = require('./services/wit').getWit();
var Handler = require('./handler');
var Interval = require('./interval')
var Helper = require('./helper')
var Response = require('./response')
var Emoji = require('./emoji_response')
var Reminder = require('./reminder')
var Data = require('./data')

const processIntro = (name, sender_psid) => {
    let response;
    if (name != null) {
        if (!(Data.hasName(name.value))) {
            Data.setName(sender_psid, name.value);
            response = {"text": `Nice to meet you ${name.value}! How are you doing today?`}
        } else {
            response = {"text": `I think that name is already taken...`}
        }
    } else {
        response = {"text": `Hi! I am Maximus, what is your name?`};
    }
    return response;
}

const processCancel = (id, name, sequence) => {
    if (sequence)
        sequence = sequence.value
    if (name)
        id = Data.getIdWithName(name.value);
    if (sequence && Data.hasReminder(id, sequence)) {
        Data.removeReminder(id, sequence);
        let response = {"text": "I have cancelled your reminder!"};
        return response;
    } else {
        return Response.getResponse('cancel reminder', name, Data.getReminder(id));
    }
}

const processText = (sender_psid, received_message) => {
        let response;
        let intent_val;

        return wit.message(received_message.text).then(async ({entities}) => {
            Data.createPerson(sender_psid);
            const name      = Helper.firstEntity(entities, 'name');
            const sequence  = Helper.firstEntity(entities, 'sequence');
            const intent    = Helper.firstEntity(entities, 'intent');
            const pizza     = Helper.firstEntity(entities, 'pizza_type');
            const datetime  = Helper.firstEntity(entities, 'datetime');
            const cancel    = Helper.firstEntity(entities, 'cancel');
            const greetings = Helper.firstEntity(entities, 'greetings');
            const features  = Helper.firstEntity(entities, 'features');
            console.log("greetings is: ", greetings);
            if (intent) {
                intent_val = Helper.firstEntity(entities, 'intent').value;
            }
            if (Data.getName(sender_psid) == null) {
                response = processIntro(name, sender_psid);
            } else if (pizza) {
            //if (pizza) {
                response = {"text":  `Ok we will order your ${pizza.value} pizza`};
            } else if (features) {
                response = Response.getResponse('features', Data.getName(sender_psid), 0);
            } else if (intent && intent_val == 'lunch') {
                response = processLunch(sender_psid, entities);
            } else if (intent && (intent_val == 'clear task' || intent_val == 'set task' || intent_val == 'complete task' || intent_val == 'view task')) {
                response = processTask(sender_psid, entities, intent_val);
            } else if ((intent && intent_val == 'cancel')|| cancel)  {
                response = processCancel(sender_psid, name, sequence);
            } else if (intent && intent_val == 'view reminders') {
                response = Reminder.viewReminder(sender_psid, name);  
            } else if (intent && intent_val == 'reminder') {
                response = processReminder(sequence, name, entities, datetime, sender_psid)
            } else if (greetings) {
                response = Response.getResponse('greetings', name, 0);  
            } else {
                console.log("getting emoji reply with ",received_message.text);
                response = await Emoji.emojiReply([received_message.text]);
                console.log("emoji reply is ", response);
                let word_res = {"text": Response.getResponse('emoji', Data.getName(sender_psid), 0)}
                console.log("word_res is ", word_res);
                setTimeout(Handler.callSendAPI, 2000, sender_psid, word_res);
            }
            Handler.callSendAPI(sender_psid, response);
            });
}

const processTask = (id, entities, intent_val) => {
    let response;
    let agenda = Helper.firstEntity(entities, 'agenda_entry');
    if (!agenda)
        agenda = Helper.firstEntity(entities, 'sequence');
    if (intent_val == 'set task' && agenda) {
        Data.markTaskAs('incomplete', id, agenda.value);
        response = {"text" : `I have added ${agenda.value} to your task!`}
    } else if (intent_val == 'clear task' && agenda) {
        if (agenda && Data.idHasValue(id, agenda.value)) {
            Data.clearTask(id, agenda.value);
            response = Response.getResponse('clear task1', Data.getName(id), 0);
        } else {
            response = Response.getResponse('clear task', Data.getName(id), Data.getTask(id));
        }
    } else if (intent_val == 'complete task') {
        if (agenda && Data.idHasValue(id, agenda.value)) {
            Data.markTaskAs('completed', id, agenda.value);
            response = Response.getResponse('completed task1', Data.getName(id), 0);
        } else {
            response = Response.getResponse('completed task', Data.getName(id), Data.getTask(id));
        }
    } else if (intent_val == 'view task' && agenda) {
        response = Response.getResponse('view task' , Data.getName(id), Data.getTask(id));
    } else {
        response = {"text": "Could you type the command again with the task you want me to keep track of?"};
    }
    return response;
}

const processLunch = (sender_psid, entities) => {
    const cancel = Helper.firstEntity(entities, 'cancel');
    if (Data.getLunchWithID(sender_psid)) {
        let interval = Interval.timeSpent(Data.getLunchWithID(sender_psid));
        if (cancel) {
            Data.setLunchWithID(sender_psid, null);
            interval = interval + " on lunch! How did you enjoy lunch?";
        } else {
            interval = "I hope you are enjoying lunch! " + interval + " on lunch!";
        }
        return {"text" : interval};
    } else if (cancel) {
        return {"text" : "I don't think I've set a lunch timer for you."};
    } else {
        let d = new Date();
        let str1 = "Ok, starting lunch time at ";
        let str2 = ". When you finish just let me know and I'll tell you how much time you've spent. Enjoy lunch!";
        let time = Interval.getTime(d);
        Data.setLunchWithID(sender_psid, d);
        return {"text" : str1 + time + str2 };
    }
}

const processReminder = (sequence, name, entities, datetime, sender_psid) => {
    let remind = Helper.firstEntity(entities, 'remind_me');
    const duration = Helper.getDuration(entities);
    let response;
    let repeat_info;
    if (!remind) {
        remind = {value : "once"};
    }
    if (!datetime) {
        response = {"text": `Could you please type the command with a specific time? `+ String.fromCodePoint(0x1F605)};
    } else {
        let interval = Interval.calcInterval(datetime.value); 
        if (interval < 0) {
            response = {"text": `I cannot remind you because the time has passed...`};
        } else {
            if (sequence != null && (Data.getIdWithName("GDDH") == sender_psid || Data.getName(sender_psid) == name.value)) {
            //if (sequence != null) {
                if (Data.getIdWithName("GDDH") == sender_psid && name && name.value != 'me') {
                    repeat_info = Interval.repeatInterval(remind.value, sequence.value, interval, name.value, duration);
                    console.log("repeat info is: ", repeat_info, " name ", name.value, " target ", Data.getIdWithName(name.value));
                    Data.addReminder(Data.getIdWithName(name.value), sequence.value, datetime.value);
                    setTimeout(Reminder.reminderFunc, repeat_info[0], Data.getIdWithName(name.value), repeat_info);
                } else {
                    repeat_info = Interval.repeatInterval(remind.value, sequence.value, interval,
                                                            Data.getName(sender_psid), duration);
                    Data.addReminder(sender_psid, sequence.value, datetime.value);
                    setTimeout(Reminder.reminderFunc, repeat_info[0], sender_psid, repeat_info);
                }
                response = {"text": `Ok we will remind you ${remind.value}`};
            } else {
                response = {"text": `Can you please type the command again with what you want me to remind you about?`};
            }
        }
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
