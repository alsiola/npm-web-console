const childProcess = require('child_process');
const killChildProcess = require('./killChildProcess');

const executeTask = (task, killEmitter, exitEmitter, initialOutEmitter) => {
    const taskProcess = childProcess.exec(task);

    process.on('SIGINT', () => {
        killChildProcess(taskProcess, killEmitter);
    });

    taskProcess.on('exit', exitEmitter);

    return taskProcess;
}

module.exports = executeTask;