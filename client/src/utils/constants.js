const CONFIG = Object.freeze({
    //any non-negative number
    RANDOM_NUM_MIN: 0,
    RANDOM_NUM_MAX: Number.MAX_SAFE_INTEGER,

    //change this to change game rules
    GAME_DIVISOR: 3,

    //winning number
    WINNING_NUM: 1,

    //time in seconds
    CONNECTION_RETRY_TIME: 5
})

const SOCKET_EVENTS = Object.freeze({
    CONNECT: 'connect',
    CONNECTION: 'connection',
    GOT_EVENT: 'got',
    INITIATE: 'init',
    CONNECTION_ERROR: 'connect_error',
    DISCONNECT: 'disconnect'
})

module.exports = {
    CONFIG,
    SOCKET_EVENTS
}