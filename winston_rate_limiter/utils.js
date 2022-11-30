const format = require("winston").format;

class TokenBucket {
  constructor(kwargs) {
    this.tokensPerSec = kwargs.tokensPerSec;
    if (typeof kwargs.tokensPerSec != "number") {
        throw "tokensPerSec must be an number";
    }
    this.bucket = kwargs.startingTokens;
    if (typeof kwargs.startingTokens != "number") {
        this.bucket = 0;
    }
    this.maxTokensBalance = kwargs.maxTokensBalance;
    if (typeof kwargs.maxTokensBalance != "number") {
        this.maxTokensBalance = Infinity;
    }
    this.lastCheck = new Date().getTime() / 1000;
  }

  isActionAllowed() {
    var current, timePassed;
    current = new Date().getTime() / 1000;
    timePassed = current - this.lastCheck;
    this.lastCheck = current;
    this.bucket = this.bucket + (timePassed * this.tokensPerSec);
    if (this.bucket > this.maxTokensBalance) {
      this.bucket = this.maxTokensBalance;
    }

    if (this.bucket < 1) {
      return false;
    } else {
      this.bucket = this.bucket - 1;
      return true;
    }
  }

}

class RateLimitingFilter {

    constructor(
        resultCallback=null, kwargs={}
    ) {
        this.rateLimiterMap = {}
        for (const property in kwargs) {
            this.rateLimiterMap[property] = new TokenBucket(kwargs[property])
        }
        this.resultCallback = resultCallback
    }

    filter(record) {
        let result = true
        if (!this.rateLimiterMap.hasOwnProperty(record.level)){
            if (!this.rateLimiterMap.hasOwnProperty("default")) {
                result = true
            } else {
                result = this.rateLimiterMap["default"].isActionAllowed()
            }
        } else {
            result = this.rateLimiterMap[record.level].isActionAllowed()
        }
        if (this.resultCallback) {
            this.resultCallback(result, record)
        }
        return result
    }
}


function rateLimitingFormat(config) {
    const _rateLimitingFilter = format((info, opts) => {
        if (opts.rateLimitingFilterObject.filter(info)){
            return info
        } else {
            return false
        }
    });
    const resultCallback = config.resultCallback
    delete config.resultCallback
    const rateLimitingFilterObject = new RateLimitingFilter(
        resultCallback, config
    )
    return _rateLimitingFilter({"rateLimitingFilterObject": rateLimitingFilterObject})
}

module.exports = {
    rateLimitingFormat
}