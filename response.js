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

const getResponse = (sequence, name, duration) => {
    let run_responses = [`${name}! It is time to run! Can we do it?`,
                         `${name}! Running time!! Are you ready?`,
                         `${name}, guess what time it is? Time to run!!! Are we going to run?`,
                         `Fire up your engines, ${name}! It is time to run! Are you ready??`,
                         `Hey ${name}, I just wanted to remind you that it is time to run! Can we do it?`,
                         `${name}, can we go for a run right now?`];
    let sleep_responses = [ `${name}! It is time to go to sleep! Can we go to sleep?`,
                            `It is time for us to sleep. Is that ok ${name}?`,
                            `Can we sleep ${name}? Please?`,
                            `We should sleep so we can get up tomorrow at the right time... Can we sleep ${name}?`,
                            `We gotta go to sleep to wake up tomorrow ${name}. Can we sleep ${name}?`];

    let workout_responses = [`${name}, It is time for us to workout! Are we ready to push ourselves?`,
                            `Workout time ${name}!! Are we doing this?`,
                            `Hey ${name}! Hey! ${name}! It is time to workout. We ready?`,
                            `${name}! It is time to workout! Are we ready?`,
                            `Let us get started on workout ${name}! Are we good to go?`];

    let i = Math.floor(Math.random()*run_responses.length);

    switch (sequence) {
        case 'to sleep':
            return createQReply(sleep_responses[i], duration);
        case 'to workout':
            return createQReply(workout_responses[i], duration);
        case 'to run':
            return createQReply(run_responses[i], duration);
        default:
            return {"text": `${name}! I am supposed to remind you of something, but I forgot...`};
    }
}

module.exports = {
    getResponse : getResponse
}
