import React from 'react';
import {FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

export default class CommandStarter extends React.Component {
    constructor() {
        super();
        this.state = {
            cmdInput: '',
            error: ''
        };
    }

    cmdInputChanged(event) {
        this.setState({
            cmdInput: event.target.value,
            error: event.target.value.length > 0 ? '' : 'No Command Entered'
        });
    }

    startCommand() {
        if (this.state.cmdInput.length > 0) {

            this.props.sendCommand(this.state.cmdInput);

            this.setState({
                cmdInput: ''
            });

        }
    }

    render() {
        return (
            <form>
                <FormGroup>
                    <ControlLabel>Enter a new command</ControlLabel>
                    <FormControl type="text" value={this.state.cmdInput} onChange={(e) => this.cmdInputChanged(e)} />
                </FormGroup>
                <FormGroup>
                    <Button bsStyle="primary" onClick={() => this.startCommand()}>Send Command</Button>
                </FormGroup>                
                {this.state.error.length > 0 && (
                    <span>{this.state.error}</span>
                )}
            </form>
        );
    }
}