
const responseLibrary = (response_type, name) => {
    let run_responses       = [`${name}! It is time to run! Can we do it?`,
                               `${name}! Running time!! Are you ready?`,
                               `${name}, guess what time it is? Time to run!!! Are we going to run?`,
                               `Fire up your engines, ${name}! It is time to run! Are you ready??`,
                               `Hey ${name}, I just wanted to remind you that it is time to run! Can we do it?`,
                               `${name}, can we go for a run right now?`];
    let sleep_responses   = [ `${name}! It is time to go to sleep! Can we go to sleep?`,
                            `It is time for us to sleep. Is that ok ${name}?`,
                            `Can we sleep ${name}? Please?`,
                            `We should sleep so we can get up tomorrow at the right time... Can we sleep ${name}?`,
                            `We gotta go to sleep to wake up tomorrow ${name}. Can we sleep ${name}?`];
    let workout_responses = [`${name}, It is time for us to workout! Are we ready to push ourselves?`,
                            `Workout time ${name}!! Are we doing this?`,
                            `Hey ${name}! Hey! ${name}! It is time to workout. We ready?`,
                            `${name}! It is time to workout! Are we ready?`,
                            `Let us get started on workout ${name}! Are we good to go?`];
    let emoji_responses  = [`${name}, I feel you.`, `I feel you ${name}.`, `I get what you are saying ${name}.`,
                            `I understand how you feel ${name}.`, `I get you, ${name}.`,
                            `I think I get you ${name}`, `Right?`, `Agreed. I feel that way too.`,
                            `Yeah, it feels like that huh?`];
    let clear_responses  = [`Gotcha ${name}. Which response would you like to clear?`,
                            `Ok, which response would you like to clear ${name}?`];
    let clear1_responses = [`Understood ${name}. I will clear it.`, `Ok clearing the task. ${name}.`, `Gotcha`];
    let complete_resps   = [`${name}! Amazing work!`, `${name}! Wow! You completed another task!`,
                            `That is what I call productivity ${name}!`, `Congrats!! You completed it!`, 
                            `One small task on a list, one big step toward your goals ${name}`,
                            `I am happy to hear that ${name}! Congrats!`, `Keep it up ${name}!`,
                            `You are working really hard ${name}!`, `Keep it up. You are doing great ${name}!`];
    let view_task        = [`These are your tasks ${name}: `];
    let view_reminders   = [`These are your reminders ${name}: `];

    switch(response_type) {
        case 'to sleep':
            return sleep_responses;
        case 'to workout':
            return workout_responses;
        case 'to run':
            return run_responses;
        case 'emoji':
            return emoji_responses;
        case 'clear task':
            return clear_responses;
        case 'clear task1':
            return clear1_responses;
        case 'completed task':
            return complete_resps;
        case 'completed task1':
            return complete_resps;
        case 'view task':
            return view_task;
        case 'view reminders':
            return view_reminders;
    }
}

module.exports = {
    responseLibrary : responseLibrary
}
