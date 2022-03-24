const CONFIG = Object.freeze({
    ALLOWED_PARTICIPANTS: 2
})

const SOCKET_EVENTS = Object.freeze({
    CONNECT: 'connect',
    CONNECTION: 'connection',
    GOT_EVENT: 'got',
    INITIATE: 'init',
    DISCONNECT: 'disconnect'
})

module.exports = {
    CONFIG,
    SOCKET_EVENTS
}