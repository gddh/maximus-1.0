var Lib = require('./library_response');

const createQReply = (text, payload) => {
    if (payload)
    {
        yes_payload = payload;
        no_payload = payload;
    } else {
        yes_payload = "yes";
        no_payload = "no";
    }
    return {"text": text,
    "quick_replies":[
        {
            "content_type":"text",
            "title":"Yes!",
            "payload": yes_payload,
            "image_url":"https://cdn.shopify.com/s/files/1/1594/7793/files/hpnew_300x.png?v=1520266845"
        },
        {
            "content_type":"text",
            "title":"No!",
            "payload": no_payload,
            "image_url":"https://i.ytimg.com/vi/R7K-crxH2J0/hqdefault.jpg"
        }
    ]};
}

const dynamicQReply = (text, possible_payloads, flag) => {
    let q_replies = []
    Object.keys(possible_payloads).forEach( payload => {
        if (possible_payloads[payload] == 'incomplete') {
            q_replies.push({
                "content_type":"text",
                "title": payload,
                "payload": flag + payload
            });
        }
    });
    return {"text": text,
            "quick_replies": q_replies};
}

const dynamicQReminder = (text, possible_payloads,flag) => {
    let q_replies = [];
    Object.keys(possible_payloads).forEach( payload => {
        q_replies.push({
            "content_type": "text",
            "title": payload + " - " + possible_payloads[payload],
            "payload": flag + payload 
        });
    });
    return {"text": text, 
            "quick_replies": q_replies};
}

const dynamicTask = (text, lst) => {
    let str = text + "\n";
    let has_completed = 0;
    Object.keys(lst).forEach( task => {
        if (lst[task] == 'completed') {
            str += String.fromCodePoint(0x2705) + " " + task + "\n" ;
            has_completed = 1;
        }
    });
    if (has_completed == 1)
        str += "\n";
    Object.keys(lst).forEach( task => {
        if (lst[task] == 'incomplete') {
            str += "- "+ task + "\n"
        }
    });
    return {"text": str};
}

const dynamicReminder = (text, lst) => {
    let str = text + "\n";
    Object.keys(lst).forEach( reminder => {
        str += "- " + reminder + " : " + lst[reminder] + "\n";
    });
    return {"text": str};
}

const getResponse = (sequence, name, payloads) => {
    let responses = Lib.responseLibrary(sequence, name);
    let i = Math.floor(Math.random() * responses.length);
    switch (sequence) {
        case 'to sleep':
        case 'to workout':
        case 'to run':
            return createQReply(responses[i], payloads);
        case 'greetings':
            return {"text": responses[i]};
        case 'features':
            return {"text": responses[i]};
        case 'emoji':
            return responses[i];
        case 'clear task1':
            return {"text": responses[i]}; 
        case 'completed task1':
            return {"text": responses[i]}; 
        case 'clear task':
            if (Object.keys(payloads).length > 0)
                return dynamicQReply(responses[i], payloads, "0");
            else
                return {"text": "There are no tasks for you to clear."};
        case 'completed task':
        case 'cancel reminder':
            if (Object.keys(payloads).length > 0)
                if (sequence == 'completed task')
                    return dynamicQReply(responses[i] + ' Which one was it?', payloads, "1");
                if (sequence == 'cancel reminder')
                    return dynamicQReminder(responses[i] + ' Which one was it?', payloads, "2");
            else
                return {"text": "There is nothing in my records! But congratulations!!!"}
        case 'view task':
            if (Object.keys(payloads).length > 0) {
                return dynamicTask(responses[i], payloads);
            } else
                return {"text": "No tasks to view! If you would like to set a task, just tell me!"};
        case 'view reminders':
            if (Object.keys(payloads).length > 0)
                return dynamicReminder(responses[i], payloads);
            else
                return {"text": "No reminders to view! If you would like to set a reminder, let me know!"};
        default:
            return {"text": `${name}! I am supposed to remind you of something, but I forgot...`};
    }
}

module.exports = {
    getResponse : getResponse
}
