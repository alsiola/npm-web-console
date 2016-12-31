const childProcess = require('child_process');

const executeTask = (task, killEmitter, exitEmitter) => {
  const taskProcess = childProcess.exec(`npm run ${task}`);

  process.on('SIGINT', () => {
      taskProcess.kill();
      killEmitter();
      process.kill();
  });

  taskProcess.on('exit', exitEmitter);

  return taskProcess;
}

module.exports = executeTask;