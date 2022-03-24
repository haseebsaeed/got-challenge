const { createServer } = require("http");
const { Server } = require("socket.io");
const initWSClient = require('../../src/services/ws-client')
const { expect } = require("chai");

const { SOCKET_EVENTS, CONFIG } = require('../../src/utils/constants')


describe("got player (ws client)", () => {
    let io, serverSocket, clientSocket, port;

    before((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            port = httpServer.address().port;
            const instance = initWSClient(`http://localhost:${port}`);
            io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
                serverSocket = socket;
            });
            clientSocket = instance.socket
            clientSocket.on(SOCKET_EVENTS.CONNECT, done);
            //so that the process doesn't exit on disconnection
            clientSocket.removeAllListeners(SOCKET_EVENTS.DISCONNECT)
        });
    });

    afterEach(() => {
        serverSocket.removeAllListeners(SOCKET_EVENTS.GOT_EVENT)
    })

    after(() => {
        clientSocket.close();
        io.close();
    });

    describe("event on init", () => {
        let arg;

        before(() => {
            arg = process.argv[2]
            process.argv[2] = "Initiator"
        })

        afterEach(() => {
            serverSocket.removeAllListeners(SOCKET_EVENTS.GOT_EVENT)
        })

        after(() => {
            process.argv[2] = arg
        })

        it("should return a number within range", (done) => {
            serverSocket.on(SOCKET_EVENTS.GOT_EVENT, (num) => {
                expect(num).to.be.a('number')
                expect(num).to.be.at.least(CONFIG.RANDOM_NUM_MIN)
                expect(num).to.be.at.most(CONFIG.RANDOM_NUM_MAX)
                done();
            });
            io.to(clientSocket.id).emit(SOCKET_EVENTS.INITIATE);
        });
    });

    it("should return a number", (done) => {
        serverSocket.on(SOCKET_EVENTS.GOT_EVENT, (num) => {
            expect(num).to.be.a('number')
            done();
        });
        io.to(clientSocket.id).emit(SOCKET_EVENTS.GOT_EVENT, 4564567);
    })


});