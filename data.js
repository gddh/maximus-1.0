'use strict';

var Time = require('./interval');

const id_to_name = {};
const name_to_id = {};

const idHasValue = (sender_psid, payload) => {
    let found = false;
    if (id_to_name[sender_psid]) {
        Object.keys(id_to_name[sender_psid].tasks).forEach(task => {
            if (task == payload) {
                found = true;
            }
        });
    }
    return found;
}

const markTaskAs = (value, sender_psid, payload) => {
    Object.keys(id_to_name[sender_psid].tasks).forEach(task => {
        if (task == payload) {
            id_to_name[sender_psid].tasks[task] = value;
            if (value == 'completed')
            	setTimeout(clearTask, 60 * 1000, sender_psid, payload);
        }
    });
    if (value == 'incomplete') {
    	id_to_name[sender_psid].tasks[payload] = value;
    }
}

const clearTask = (sender_psid, payload) => {
    delete id_to_name[sender_psid].tasks[payload];
}

const getTask = (sender_psid) => {
    return id_to_name[sender_psid].tasks;
}

const hasTask = (sender_psid, task) => {
    if (id_to_name[sender_psid])
        return (task in id_to_name[sender_psid].tasks);
    else
        console.log("No id_to_name[sender_psid] in hasTask");
}

const getName = (sender_psid) => {
    return id_to_name[sender_psid].name;
}

const setName = (sender_psid, name) => {
	id_to_name[sender_psid].name = name;
	name_to_id[name] = sender_psid;
}

const hasName = (name) => {
    return (name in name_to_id);
}

const getIdWithName = (name) => {
    return name_to_id[name];
}

const hasReminder = (sender_psid, reminder) => {
    if (id_to_name[sender_psid])
        return (reminder in id_to_name[sender_psid].reminders);
    else
        console.log("No id_to_name[sender_psid] in hasReminder");
}

const getReminder = (sender_psid) => {
    return id_to_name[sender_psid].reminders;
}

const addReminder = (sender_psid, value, time) => {
	id_to_name[sender_psid].reminders[value] = Time.getTime(time);
}

const removeReminder = (sender_psid, value) => {
    delete id_to_name[sender_psid].reminders[value]
}

const getLunchWithID = (sender_psid) => {
    return id_to_name[sender_psid].lunch;
}

const setLunchWithID = (sender_psid, val) => {
    return id_to_name[sender_psid].lunch = val;
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
        id_to_name[personID] = {name : null, reminders : {}, lunch : null, tasks : {}};
    }
}

module.exports = {
	idHasValue: idHasValue,
    markTaskAs: markTaskAs,
	clearTask: clearTask,
    getName: getName,
    getTask: getTask,
    getReminder: getReminder,
    createPerson: createPerson,
    hasName: hasName,
    getIdWithName: getIdWithName,
    setLunchWithID: setLunchWithID,
    getLunchWithID: getLunchWithID,
    addReminder: addReminder,
    setName: setName,
    removeReminder: removeReminder,
    hasReminder: hasReminder,
    hasTask: hasTask
}
