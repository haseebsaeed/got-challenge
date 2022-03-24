const { Server } = require("socket.io");
const { CONFIG, SOCKET_EVENTS } = require('../utils/constants')

let instance = null

//websocket server to mediate the GOT
class WSService {

    constructor(server) {
        this.io = new Server(server);
        this.io.on(SOCKET_EVENTS.CONNECTION, socket => this.onConnect(socket));
    }

    async onConnect(socket) {

        const activeSockets = await this.getAllSockets()

        //remove overflowing socket connections
        if (this.isConnectionsOverFlowing(activeSockets)) socket.disconnect()

        //initiate the game
        if (this.isConnectionsComplete(activeSockets)) this.io.emit(SOCKET_EVENTS.INITIATE)

        this.registerEventListeners(socket)

    }

    async getAllSockets() {
        return await this.io.fetchSockets()
    }

    //checks to see if the new connection has exceeded the limit of participants
    isConnectionsOverFlowing(activeSockets) {
        return activeSockets.length > CONFIG.ALLOWED_PARTICIPANTS
    }

    //checks to see if required number of participants have joined the game
    isConnectionsComplete(activeSockets) {
        return activeSockets.length === CONFIG.ALLOWED_PARTICIPANTS
    }

    registerEventListeners(socket) {
        socket.on(SOCKET_EVENTS.GOT_EVENT, (num) => this.onReceivingNum(num, socket))

        socket.on(SOCKET_EVENTS.DISCONNECT, () => this.onDisconnect())
    }

    /**
     * On receiving a number, broadcast it (to the other player)
     * @param {*} num number to be passed
     * @param {*} socket socket of the sender
     */
    onReceivingNum(num, socket) {
        socket.broadcast.emit(SOCKET_EVENTS.GOT_EVENT, num)
    }

    //if one of the socket is disconnected (game end or left), disconnect all (the other socket) as well
    onDisconnect() {
        this.io.disconnectSockets()
    }


}


module.exports = function initWSService(server) {
    return instance = instance || new WSService(server)
}