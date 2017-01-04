const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const executeTask = require('./lib/executeTask');
const killChildProcess = require('./lib/killChildProcess');

require('dotenv').config();

const runningTasks = new Map();

io.on('connection', socket => {
    socket.on('command', cmd => {
        try {
            const task = executeTask(cmd, () => {
                io.emit('server_stopped', cmd);
            }, () => {
                io.emit('cmd_exited', cmd);
            });
            runningTasks.set(cmd, task);
            io.emit('cmd_start', cmd);

            task.stdout.on('data', chunk => {
                const d = new Date();
                io.emit('cmdOutput', {
                    cmd: cmd,
                    output: d.toTimeString().substr(0,8) + ": " + chunk
                });
            });

            task.stderr.on('data', chunk => {
                const d = new Date();
                io.emit('cmdOutput', {
                    cmd: cmd,
                    output: d.toTimeString().substr(0,8) + ": " + chunk
                });
            });
        }
        catch (e) {
            io.emit('start_fail', cmd);
        }
    });

    socket.on('kill', cmd => {
        try {
            killChildProcess(runningTasks.get(cmd), () => {                
                io.emit('kill_success', cmd);
            });
        }
        catch (e) {
            io.emit('kill_fail', cmd);
        }
    })
} )

app.use(express.static('dist'));

server.listen(process.env.PORT || 8080, () => {
    console.log("Listening on " + process.env.PORT || 8080)
});