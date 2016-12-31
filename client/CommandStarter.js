import React from 'react';

export default class CommandStarter extends React.Component {
    constructor() {
        super();
        this.state = {
            cmdInput: ''
        };
    }

    cmdInputChanged(event) {
        this.setState({
            cmdInput: event.target.value
        });
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.cmdInput} onChange={(e) => this.cmdInputChanged(e)} />
                <button onClick={() => this.props.sendCommand(this.state.cmdInput)}>Send Command</button>
            </div>
        );
    }
}