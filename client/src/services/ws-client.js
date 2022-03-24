const { io } = require("socket.io-client")

const GameService = require("./game")

const { CONFIG, SOCKET_EVENTS } = require('../utils/constants')

//Web socket client for player actions
class WSClient {
    constructor(url) {
        this.socket = io(url)
        this.gameService = new GameService()
        this.registerEventListener()
    }

    //register event listeners to play the game
    registerEventListener() {
        this.socket.on(SOCKET_EVENTS.CONNECT, () => this.onConnection())

        this.socket.on(SOCKET_EVENTS.INITIATE, () => this.onInit())

        this.socket.on(SOCKET_EVENTS.GOT_EVENT, (num) => this.onGOTEvent(num));

        this.socket.on(SOCKET_EVENTS.CONNECTION_ERROR, () => this.onConnectionError());

        this.socket.on(SOCKET_EVENTS.DISCONNECT, () => this.onDisconnect())
    }

    onConnection() {
        console.log("Connected!")
    }

    //initiate the game if the user is initiator
    onInit() {
        if (this.isInitiator()) {
            this.socket.emit(SOCKET_EVENTS.GOT_EVENT, this.gameService.generateRandomNumber())
        }
    }

    //checks to see if arguements have 'Initiator'
    isInitiator() {
        return process.argv[2] === 'Initiator'
    }

    /**
     * action to be performed on receiveing a number
     * make the number divisible by Divisor, divide and push the divided number
     * @param {*} num number of be divided
     */
    onGOTEvent(num) {
        const result = this.gameService.processNumber(num)

        if (this.gameService.isWinningCondition(result)) {
            console.log(`Winner!!!`)
            process.exit()
        }
        else {
            this.socket.emit(SOCKET_EVENTS.GOT_EVENT, result);
        }
    }

    //retry mechanism if the socket server hasn't started yet
    onConnectionError() {
        console.error(`Connection failed with other player, retrying in ${CONFIG.CONNECTION_RETRY_TIME} seconds`)
        setTimeout(() => {
            this.socket.connect();
        }, CONFIG.CONNECTION_RETRY_TIME * 1000);
    }

    onDisconnect() {
        process.exit()
    }
}

module.exports = function initWSClient(url) {
    return new WSClient(url)
}