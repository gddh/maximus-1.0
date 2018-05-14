'use strict'

var Config = require('../config');

let Wit = null;
    let log = null;
    try {
        // if running from repo
        Wit = require('../').Wit;
        log = require('../').log;
    } catch (e) {
        Wit = require('node-wit').Wit;
        log = require('node-wit').log;
    }

// Setting up our bot
var getWit = function() { 
    console.log('GRABBING WIT');
    return new Wit(
            {accessToken: Config.WIT_TOKEN,
                logger: new log.Logger(log.INFO)});
}

module.exports = {
    getWit: getWit
}
