require('dotenv').config()

const initWSClient = require('./services/ws-client')

const SERVER = process.env.SERVER || 'http://localhost'
const PORT = process.env.PORT || 3000

initWSClient(`${SERVER}:${PORT}`)