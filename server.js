require('dotenv').config({ path: './config.env' });
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./persistence/mongo');

const server = express();

server.use(bodyParser.json());

const db = new Database(process.env.MONGO_URL, process.env.MONGO_PORT, process.env.MONGO_DB)

const issuesRouter = require('./routes/issues')(db);
server.use('/api/issues', issuesRouter);


const PORT = process.env.PORT;
http.createServer(server)
    .listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
    });