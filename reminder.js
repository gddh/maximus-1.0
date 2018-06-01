'use strict';
var Data        = require('./data');
var Handler     = require('./handler');
var Response    = require('./response');

const reminderFunc = (target_psid, repeat_info) => {
    let response = Response.getResponse(repeat_info[3], repeat_info[2], repeat_info[5]);
    if (repeat_info[3] in Data.getReminder(target_psid)) {
        if (repeat_info[1] == 0) {
            Data.removeReminder(target_psid, repeat_info[3]);
        }
        Handler.callSendAPI(target_psid, response); 
    } else {
        repeat_info[1] = 0;
        Data.removeReminder(target_psid, repeat_info[3]);
    }
    if (repeat_info[1] == 1) {
        setTimeout(reminderFunc, repeat_info[4], target_psid, repeat_info);
    }
}

const viewReminder = (psid, name) => {
    let reminders = Data.getReminder(psid);
    let response = Response.getResponse("view reminders", name, reminders);
    Handler.callSendAPI(psid, response);
}

module.exports = {
    reminderFunc: reminderFunc,
    viewReminder: viewReminder
}
