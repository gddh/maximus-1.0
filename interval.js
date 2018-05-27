const repeatInterval = (remind_keyword, sequence, time_interval, name, duration) => {
    switch (remind_keyword) {
        case 'secondly':
            return [time_interval, 1, name, sequence, 1 * 1000, duration];
        case 'minutely':
            return [time_interval, 1, name, sequence, 60 * 1000, duration];
        case 'daily':
            return [time_interval, 1, name, sequence, 24 * 3600 * 1000, duration];
        case 'hourly':
            return [time_interval, 1, name, sequence, 3600 * 1000, duration];
        case 'once':
            return [time_interval, 0, name, sequence, 0, duration];
    }
}

const calcInterval = (datetime) => {
    let etime = new Date(datetime.value);
    let e_hr = etime.getHours();
    let e_min = etime.getMinutes();
    let e_sec = etime.getSeconds(); 
    let curtime = new Date();
    let cur_hr = curtime.getHours();
    let cur_min = curtime.getMinutes();
    let cur_sec = curtime.getSeconds();
    let interval = ((e_hr - cur_hr) * 3600 + (e_min - cur_min) * 60 + (e_sec - cur_sec)) * 1000;
    return interval;
}

module.exports = {
    calcInterval: calcInterval,
    repeatInterval: repeatInterval
}
