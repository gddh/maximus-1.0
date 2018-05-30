'use strict';
var Process     = require('./process');
var Handler     = require('./handler');
var Response    = require('./response');

const reminderFunc = (target_psid, repeat_info) => {
    console.log("Handler is ", Handler);
    console.log("Response is ", Response);
    console.log("Process is ", Process);
    let response = Response.getResponse(repeat_info[3], repeat_info[2], repeat_info[5]);
    if (Process.getName(target_psid).includes(repeat_info[3])) {
        console.log(`sending ${response}`);
        Handler.callSendAPI(target_psid, response);
    } else {
        repeat_info[1] = 0;
    }
    if (repeat_info[1] == 1) {
        setTimeout(reminderFunction, repeat_info[4], target_psid, repeat_info);
    }
}

const viewReminder = (psid, name) => {
    let reminders = Process.getReminder(psid);
    let response = Response.getResponse("view reminder", name, reminders);
    Handler.callSendAPI(psid, response);
}

module.exports = {
    reminderFunc: reminderFunc,
    viewReminder: viewReminder
}
