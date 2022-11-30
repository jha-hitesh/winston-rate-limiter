# winston-rate-limiter

a simple winston format which can be used to limit the amount of logs getting out from a system.
It uses token bucket algorithm internally.


#### Installation

- from npm
```
npm install winston-rate-limiter
```

#### Usage
- check [example](__tests__/test.logging.js) for a complete example
- the format is available as
```
const { RateLimitingFilter } = require("winston-rate-limiter").utils;
```
- on a basic level this format can be added to a winston logger or to winston.format.combine
- this format takes a key called config which has multiple optional keywords with key as log_level and value as a dict with below 3 keys
```
"DEBUG": {
    "tokensPerSec": 1,
    "startingTokens": 1, # optional, default=0
    "maxTokensBalance": 1 # optional, default=Infinity
}
```
- `tokensPerSec`: the number of tokens(logs) which will be available for a given log level
- `startingTokens`: the number of tokens already available at the start of the logging initialisation
- `maxTokensBalance`: the maximum number of tokens that can be accumulated if the logs for a particular level are not being requested as much as the `tokensPerSec` allowed. kind of limited burst balance.
- besides providing this config for particular log levels, you can supply a `default` key with this config.
- if a `default` is supplied and there is no config supplied for a requested log level then this requested log level will be checked against this default config. useful for scenario where you want an overall rate shared across multiple log levels.
- besides this an optional `resultCallback` can be supplied which will be called everytime a log record goes through format function
- the `resultCallback` must accept 2 params `result` which is a boolean telling whether the log record was filtered or not and `record` the original log record.


#### Local development and testing

- build the docker-image of the package `docker-compose build --no-cache`
- run the image `docker-compose up`
- go to the container `docker exec -it winstonformattester sh`
- to run tests first install jest `npm install jest` then `jest` to run the actual tests.


#### License

- this project is licensed under [MIT License](LICENSE)