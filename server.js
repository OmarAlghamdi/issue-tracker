// @ts-check

require('dotenv').config({ path: './config.env' });
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./persistence/mongo');

const server = express();

server.use(bodyParser.json());

// connect to MongoDB
const db = new Database(process.env.MONGO_URL, process.env.MONGO_PORT, process.env.MONGO_DB)

// mount routers
const issuesRouter = require('./routes/issues')(db);
const usersRouter = require('./routes/users')(db);
const commentsRouter = require('./routes/comments')(db);
server.use('/api/issues', issuesRouter);
server.use('/api/users', usersRouter);
server.use('/api/comments', commentsRouter);

// start server
const PORT = process.env.PORT;
http.createServer(server)
    .listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
    });