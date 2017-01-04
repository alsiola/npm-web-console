import React from 'react';
import io from 'socket.io-client';
import update from 'react-addons-update';
import CommandBox from './CommandBox';
import CommandStarter from './CommandStarter';
import RunningTasks from './RunningTasks';
import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import './App.css';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            tasks: {}
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

            this.setState({
                tasks: update(this.state.tasks, {                
                    [cmd]: {                    
                        isRunning: { $set : false }
                    }
                })
            });
        });

        socket.on('server_stopped', cmd => {
            this.addOutput(cmd, "Server has been stopped.");
        });

        socket.on('kill_fail', cmd => {
            this.addOutput(cmd, "Process kill failed.");
        });
    }

    sendCommand(cmd) {
        this.socket.emit('command', cmd);
    }

    killProcess(cmd) {
        this.socket.emit('kill', cmd);
        this.addOutput(cmd, "*** KILL COMMAND SENT ***");
    }


    addCommand(cmd) {
        this.setState({
            tasks: update(this.state.tasks, {
                $merge: {
                    [cmd]: {
                        command: cmd,
                        output: [],
                        isRunning: true,
                        visible: true
                    }
                }
            })
        });
    }

    addOutput(cmd, output) {
        if (typeof this.state.tasks[cmd] === 'undefined') {
            this.addCommand(cmd);
        }

        this.setState({
            tasks : update(this.state.tasks, {
                [cmd]: {output : {$push : [output]}}
            })
        });
    }

    setVisibility(cmd, visible) {
        this.setState({
            tasks: update(this.state.tasks, {
                [cmd]: {
                    visible: { $set : visible}
                }
            })
        });
    }

    render() {
        const commandBoxes = Object.values(this.state.tasks).filter(task => task.visible).map((task, i) => (
            <Col xs={6} key={i} >
                <CommandBox 
                    command={task.command} 
                    output={task.output} 
                    killProcess={cmd => this.killProcess(cmd)}
                    isRunning={task.isRunning}
                    hideBox={cmd => this.setVisibility(cmd, false)}
                />
            </Col>
        ));

        return (
            <Grid>
                <Row>
                    <PageHeader>NPM Web Console</PageHeader>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <CommandStarter sendCommand={cmd => this.sendCommand(cmd)} />
                    </Col>
                    <Col xs={12} md={6}>
                        <RunningTasks 
                            tasks={Object.values(this.state.tasks).filter(task => task.isRunning)} 
                            toggleVisible={(cmd, vis) => this.setVisibility(cmd, vis)}
                        />
                    </Col>
                </Row>
                <Row>
                    {commandBoxes}
                </Row>
            </Grid>
        )
    }
}