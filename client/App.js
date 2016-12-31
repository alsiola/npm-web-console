import React from 'react';
import io from 'socket.io-client';
import CommandBox from './CommandBox';
import CommandStarter from './CommandStarter';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            runningCommands: {}
        }
        this.socket = io();
        this.initSockets(this.socket);
    }

    initSockets(socket) {
        socket.on('cmdOutput', cmdOutput => {
            this.addOutput(cmdOutput.cmd, cmdOutput.output);
        });

        socket.on('cmd_start', cmd => {
            this.addCommand(cmd);
        });

        socket.on('cmd_exited', cmd => {
            this.addOutput(cmd, "Process has exited gracefully.");
        });

        socket.on('cmd_dead', cmd => {
            this.addOutput(cmd, "Server has been stopped.");
        });
    }

    sendCommand(cmd) {
        this.socket.emit('command', cmd);
    }


    addCommand(cmd) {
        this.setState({
            runningCommands: Object.assign({}, this.state.runningCommands, {
                [cmd]: []
            })
        })
    }

    addOutput(cmd, output) {
        if (typeof this.state.runningCommands[cmd] === 'undefined' || !Array.isArray(this.state.runningCommands[cmd])) {
            this.addCommand(cmd);
        }

        const runningCommands = Object.assign({}, this.state.runningCommands);

        runningCommands[cmd].push(output);

        this.setState({
            runningCommands: runningCommands
        });
    }

    render() {
        const commandBoxes = Object.keys(this.state.runningCommands).map((cmd, i) => (
            <CommandBox command={cmd} output={this.state.runningCommands[cmd]} key={i} />
        ));

        return (
            <div>
                <CommandStarter sendCommand={cmd => this.sendCommand(cmd)} />
                {commandBoxes}
            </div>
        )
    }
}