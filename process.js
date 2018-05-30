'use strict';

var wit = require('./services/wit').getWit();
var Handler = require('./handler');
var Interval = require('./interval')
var Helper = require('./helper')
var Response = require('./response')
var Emoji = require('./emoji_response')
var Reminder = require('./reminder')

const id_to_name = {};
const name_to_id = {};

const reminderFunction = (target_psid, repeat_info) => {
    let response = Response.getResponse(repeat_info[3], repeat_info[2], repeat_info[5]);
    if (id_to_name[target_psid].reminders.includes(repeat_info[3])) {
        Handler.callSendAPI(target_psid, response);
    } else {
        repeat_info[1] = 0;
    }
    if (repeat_info[1] == 1) {
        setTimeout(reminderFunction, repeat_info[4], target_psid, repeat_info);
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

        return wit.message(received_message.text).then(async ({entities}) => {
            createPerson(sender_psid);
            const name = Helper.firstEntity(entities, 'name');
            const sequence = Helper.firstEntity(entities, 'sequence');
            const intent = Helper.firstEntity(entities, 'intent');
            const pizza = Helper.firstEntity(entities, 'pizza_type');
            const datetime = Helper.firstEntity(entities, 'datetime');
            if (intent)
                intent_val = Helper.firstEntity(entities, 'intent').value;
//            if (id_to_name[sender_psid].name == null) {
//                response = processIntro(name, sender_psid);
//            } else if (pizza) {
            if (pizza) {
                response = {"text":  `Ok we will order your ${pizza.value} pizza`};
            } else if (intent && intent_val == 'lunch') {
                response = processLunch(sender_psid, entities);
            } else if (intent && (intent_val == 'clear task' || intent_val == 'set task' || intent_val == 'complete task' || intent_val == 'view task')) {
                response = processTask(sender_psid, entities, intent_val);
            } else if (intent && intent_val == 'cancel' && cancel) {
                processCancel(name, sequence);
            } else if (intent && intent_val == 'view reminder') {
                response = Reminder.viewReminder(sender_psid, name);  
            } else if (intent && intent_val == 'reminder') {
                response = processReminder(sequence, name, entities, datetime, sender_psid)
            } else {
                response = await Emoji.emojiReply([received_message.text]);
                let word_res = {"text": Response.getResponse('emoji', id_to_name[sender_psid].name, 0)}
                setTimeout(Handler.callSendAPI, 2000, sender_psid, word_res);
            }
            Handler.callSendAPI(sender_psid, response);
        })
}

const processTask = (id, entities, intent_val) => {
    console.log("In PROCESS TASK");
    let response;
    let agenda = Helper.firstEntity(entities, 'agenda_entry');
    if (intent_val == 'set task') {
        getTask(id)[agenda.value] = 'uncompleted';
        response = {"text" : `I have added ${agenda.value} to your task!`}
    } else if (intent_val == 'clear task') {
        if (agenda && inIdToName(id, agenda.value)) {
            clearTask(id, agenda.value);
            response = Response.getResponse('clear task1', getName(id), 0);
        } else {
            response = Response.getResponse('clear task', getName(id), getTask(id));
        }
    } else if (intent_val == 'complete task') {
        if (agenda && inIdToName(id, agenda.value)) {
            markAsCompleted(id, agenda.value);
            response = Response.getResponse('completed task1', getName(id), 0);
        } else {
            response = Response.getResponse('completed task', getName(id), getTask(id));
        }
    } else if (intent_val == 'view task') {
        response = Response.getResponse('view task' , getName(id), getTask(id));
    }
    return response;
}

const processLunch = (sender_psid, entities) => {
    const cancel = Helper.firstEntity(entities, 'cancel');
    if (id_to_name[sender_psid].lunch) {
        let interval = Interval.timeSpent(id_to_name[sender_psid].lunch);
        if (cancel) {
            id_to_name[sender_psid].lunch = null;
            interval = interval + " on lunch! How did you enjoy lunch?";
        } else {
            interval = "I hope you are enjoying lunch! " + interval + " on lunch!";
        }
        return {"text" : interval};
    } else if (cancel) {
        return {"text" : "I don't think I've set a lunch timer for you."};
    } else {
        let d = new Date();
        let hour = d.getHours().toString();
        let min = d.getMinutes();
        let str1 = "Ok, starting lunch time at ";
        let str2 = ". When you finish just let me know and I'll tell you how much time you've spent. Enjoy lunch!";
        if (min < 10)
            min = '0' + min.toString();
        else
            min = min.toString();
        id_to_name[sender_psid].lunch = d;
        return {"text" : str1 + hour + ":" + min + str2 };
    }
}

const processReminder = (sequence, name, entities, datetime, sender_psid) => {
    let remind = Helper.firstEntity(entities, 'remind_me');
    const duration = Helper.getDuration(entities);
    let response;
    if (!remind) {
        remind = {value : "once"};
    }
    if (!datetime) {
        response = {"text": `Could you please type the command with a specific time? `+String.fromCodePoint(0x1F605)};
    } else {
        let interval = Interval.calcInterval(datetime.value); 
        if (interval < 0) {
            response = {"text": `I cannot remind you because the time has passed...`};
        } else {
            //if (sequence != null && (name_to_id["GDDH"] == sender_psid || id_to_name[sender_psid].name == name.value))
            if (sequence != null)
            {
                let repeat_info;
                if (name_to_id["GDDH"] == sender_psid && name && name.value != 'me') {
                    repeat_info = Interval.repeatInterval(remind.value, sequence.value, interval, name.value, duration);
                    id_to_name[name_to_id[name.value]].reminders.push(sequence.value);
                    setTimeout(Reminder.reminderFunc, repeat_info[0], name_to_id[name.value], repeat_info);
                } else {
                    repeat_info = Interval.repeatInterval(remind.value, sequence.value, interval,
                                                            getName(sender_psid), duration);
                    id_to_name[sender_psid].reminders.push(sequence.value);
                    console.log("reminder function is: ", Reminder);
                    setTimeout(Reminder.reminderFunc, repeat_info[0], sender_psid, repeat_info);
                }
                response = {"text": `Ok we will remind you ${remind.value}`};
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

const inIdToName = (sender_psid, payload) => {
    let found = false;
    if (id_to_name[sender_psid]) {
        Object.keys(id_to_name[sender_psid].tasks).forEach(task => {
            if (task == payload) {
                console.log("returning true");
                found = true;
            }
        });
    }
    return found;
}

const markAsCompleted = (sender_psid, payload) => {
    Object.keys(id_to_name[sender_psid].tasks).forEach(task => {
        if (task == payload) {
            id_to_name[sender_psid].tasks[task] = 'completed';
            setTimeout(clearTask, 60 * 1000, sender_psid, payload);
        }
    });
}

const clearTask = (sender_psid, payload) => {
    delete id_to_name[sender_psid].tasks[payload];
}

const getName = (sender_psid) => {
    return id_to_name[sender_psid].name;
}

const getReminder = (sender_psid) => {
    return id_to_name[sender_psid].reminders;
}

const getIdWithName = (name) => {
    return name_to_id[name];
}

const getTask = (sender_psid) => {
    return id_to_name[sender_psid].tasks;
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
        id_to_name[personID] = {name : null, reminders : [], lunch : null, tasks : {}};
    }
}

module.exports = {
    processAttachments: processAttachments,
    processText: processText,
    inIdToName: inIdToName,
    markAsCompleted: markAsCompleted,
    clearTask: clearTask,
    getName: getName,
    getTask: getTask,
    getReminder: getReminder
}
