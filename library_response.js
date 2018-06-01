
const responseLibrary = (response_type, name) => {
    let run_responses       = [`${name}! It is time to run! Can we do it?`,
                               `${name}! Running time!! Are you ready?`,
                               `${name}, guess what time it is? Time to run!!! Are we going to run?`,
                               `Fire up your engines, ${name}! It is time to run! Are you ready??`,
                               `Hey ${name}, I just wanted to remind you that it is time to run! Can we do it?`,
                               `${name}, can we go for a run right now?`];
    let sleep_responses     = [ `${name}! It is time to go to sleep! Can we go to sleep?`,
                                `It is time for us to sleep. Is that ok ${name}?`,
                                `Can we sleep ${name}? Please?`,
                                `We should sleep so we can get up tomorrow at the right time... Can we sleep ${name}?`,
                                `We gotta go to sleep to wake up tomorrow ${name}. Can we sleep ${name}?`];
    let workout_responses   = [`${name}, It is time for us to workout! Are we ready to push ourselves?`,
                                `Workout time ${name}!! Are we doing this?`,
                                `Hey ${name}! Hey! ${name}! It is time to workout. We ready?`,
                                `${name}! It is time to workout! Are we ready?`,
                                `Let us get started on workout ${name}! Are we good to go?`];
    let emoji_responses     = [`${name}, I feel you.`, `I feel you ${name}.`, `I get what you are saying ${name}.`,
                                `I understand how you feel ${name}.`, `I get you, ${name}.`,
                                `I think I get you ${name}`, `Right?`, `Agreed. I feel that way too.`,
                                `Yeah, it feels like that huh?`];
    let clear_responses     = [`Gotcha ${name}. Which task would you like to clear?`,
                                `Ok, which task would you like to clear ${name}?`];
    let clear1_responses    = [`Understood ${name}. I will clear it.`, `Ok clearing the task. ${name}.`, `Gotcha`];
    let complete_resps      = [`${name}! Amazing work!`, `${name}! Wow! You completed another task!`,
                                `That is what I call productivity ${name}!`, `Congrats!! You completed it!`, 
                                `One small task on a list, one big step toward your goals ${name}`,
                                `I am happy to hear that ${name}! Congrats!`, `Keep it up ${name}!`,
                                `You are working really hard ${name}!`, `Keep it up. You are doing great ${name}!`];
    let view_task           = [`These are your tasks ${name}: `];
    let view_reminders      = [`These are your reminders ${name}: `];
    let cancel_resps        = [`Gotcha ${name}. Which reminder would you like to cancel?`,
                                `Ok, which reminder would you like to cancel ${name}?`];
    let greetings           = [`Hi ${name}! How are you?`, `Hi! How are you doing ${name}`, 
                                `Hi ${name}, how can I help you?`, `Hey ${name}! How can I help you?`,
                                `Hey there! How has your day been ${name}?`, `Hey, how are you doing? ${name}`,
                                `Hi!!`, `Hey! How is it going ${name}?`, `Hey ${name}, how is it going?`];
    let features            = [`Hi ${name}! Right now, I support the following features: \n - todo/goal list: set task do homework, complete task, clear task, view task \n - reminders: set reminder to workout at 5:42AM (daily) (for 30 minutes), cancel reminder, view reminders\n - lunch: just tell me your going to lunch and when you come back!`];

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
        case 'cancel reminder':
            return cancel_resps;
        case 'view task':
            return view_task;
        case 'view reminders':
            return view_reminders;
        case 'features':
            return features;
        case 'greetings':
            return greetings;
    }
}

module.exports = {
    responseLibrary : responseLibrary
}
