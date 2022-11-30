const winston = require("winston");
const TransportStream = require('winston-transport');
const {execSync} = require('child_process');
const { rateLimitingFormat } = require("../index.js").utils;

global.logList = new Array();
// a custom array transport for testing, but this format can be used with any transport of user's choice.

class ArrayTransport extends TransportStream {
    log(info, callback) {
        logList.push(info["MESSAGE"])
        console.log(JSON.stringify(info))
    }
}
const logger = winston.createLogger({
    level: "debug",
    format: rateLimitingFormat({
        "default": {
            "tokensPerSec": 1,
            "startingTokens": 1,
            "maxTokensBalance": 1
        },
        "debug": {
            "tokensPerSec": 1,
            "startingTokens": 1,
            "maxTokensBalance": 1
        },
        "resultCallback": null
    }),
    defaultMeta: {},
    transports: [
        new ArrayTransport()
    ],
});

describe('winston rate limiting format', () => {
    test('log level test', () => {
        logger.debug("test")
        expect(logList.length).toBe(1);
        logger.debug("test")
        expect(logList.length).toBe(1);
        logger.debug("test")
        expect(logList.length).toBe(1);
        logger.debug("test")
        expect(logList.length).toBe(1);
        logger.debug("test")
        expect(logList.length).toBe(1);
        logger.debug("test")
        expect(logList.length).toBe(1);
    });
});
