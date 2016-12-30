var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var childProcess = require('child_process');

require('dotenv').config();


io.on('connection', socket => {
    socket.on('command', cmd => {
        console.log(cmd);
        const task = executeTask(cmd);
        task.stdout.on('data', chunk => {
            console.log(chunk);
            io.emit('cmdOutput', {
                cmd: cmd,
                output: chunk
            });
        });
    });
} )

app.use(express.static('client'));

server.listen(process.env.PORT, () => {
    console.log("Listening on " + process.env.PORT)
});

const executeTask = task => {
  const taskProcess = childProcess.exec(`npm run ${task} -- --color`);

  process.on('SIGINT', taskProcess.kill);

  return taskProcess;
}