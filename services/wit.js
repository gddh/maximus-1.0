'use strict'

var Config = require('../config');

// Setting up our bot
var getWit = function() { 
    let Wit = null;
    let log = null;
    Wit = require('node-wit').Wit;
    log = require('node-wit').log;
    console.log('GRABBING WIT');
    return new Wit(
            {accessToken: Config.WIT_TOKEN,
                logger: new log.Logger(log.INFO)});
}

module.exports = {
    getWit: getWit
}
