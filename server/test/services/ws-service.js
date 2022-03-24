const { createServer } = require("http");

const initWSService = require('../../src/services/ws-service')
const { SOCKET_EVENTS } = require('../../src/utils/constants')

const Client = require("socket.io-client");
const assert = require("chai").assert;


describe("Socket server", () => {
    let io, clientSocket, httpServer, port;

    before((done) => {
        httpServer = createServer();
        let instance = initWSService(httpServer)
        io = instance.io
        httpServer.listen(() => {
            port = httpServer.address().port;
            done()
        });
    });

    beforeEach((done) => {
        clientSocket = new Client(`http://localhost:${port}`);
        clientSocket.on(SOCKET_EVENTS.CONNECT, done);
    })

    afterEach((done) => {
        clientSocket.close()
        done()
    })

    after(() => {
        io.close();
    });

    it("should send init event to all sockets on second connection", (done) => {
        new Client(`http://localhost:${port}`);
        clientSocket.on(SOCKET_EVENTS.INITIATE, () => {
            done();
        });
    });

    it("should disconnect third connection", (done) => {
        const second = new Client(`http://localhost:${port}`);
        const third = new Client(`http://localhost:${port}`);
        third.on(SOCKET_EVENTS.DISCONNECT, () => {
            done();
        });
    })

    it("should pass message of one connection to the other", (done) => {
        const num = 15
        clientSocket.on(SOCKET_EVENTS.GOT_EVENT, (input) => {
            assert.equal(input, num);
            done()
        })
        const second = new Client(`http://localhost:${port}`);
        second.on(SOCKET_EVENTS.CONNECT, () => {
            second.emit("got", num)
        });
    })

});