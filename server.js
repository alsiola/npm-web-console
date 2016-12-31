const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const executeTask = require('./lib/executeTask');

require('dotenv').config();

const runningTasks = new Map();

io.on('connection', socket => {
    socket.on('command', cmd => {
        console.log(cmd);
        try {
            const task = executeTask(cmd, () => {
                io.emit('cmd_dead', cmd);
            }, () => {
                io.emit('cmd_exited', cmd);
            });

            runningTasks.set(cmd, task);

            io.emit('cmd_start', cmd);

            task.stdout.on('data', chunk => {
                io.emit('cmdOutput', {
                    cmd: cmd,
                    output: chunk
                });
            });
        }
        catch (e) {
            io.emit('start_fail', cmd);
        }
    });

    socket.on('kill', cmd => {
        try {
            runningTasks.get(cmd).kill();
        }
        catch (e) {
            io.emit('kill_fail', cmd);
        }
        io.emit('kill_success', cmd);
    })
} )

app.use(express.static('dist'));

server.listen(process.env.PORT || 8080, () => {
    console.log("Listening on " + process.env.PORT || 8080)
});