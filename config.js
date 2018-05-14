'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN;
if (!WIT_TOKEN) {
	throw new Error('Missing WIT_TOKEN.');
}

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; 
if (!PAGE_ACCESS_TOKEN) {
	throw new Erorr('Missing PAGE_ACCESS_TOKEN.')
}

const VERIFY_TOKEN = "<test>";

module.exports = {
	WIT_TOKEN: WIT_TOKEN,
	PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,
	VERIFY_TOKEN: VERIFY_TOKEN
}
