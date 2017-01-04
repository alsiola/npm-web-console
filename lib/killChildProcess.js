// Windows-specific child process kill function
// see http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn

const childProcess = require('child_process');

const killChildProcess = function(child, killEmitter) {
  var isWin = /^win/.test(process.platform);
  if(!isWin) {
      kill(child.pid);
  } else {
      childProcess.exec('taskkill /PID ' + child.pid + ' /T /F');             
  }

  killEmitter();
}

module.exports = killChildProcess;