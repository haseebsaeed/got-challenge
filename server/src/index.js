require('dotenv').config()

const { createServer } = require('http');
const server = createServer();

const initWSService = require('./services/ws-service')

const PORT = process.env.PORT || 3000

initWSService(server)

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
