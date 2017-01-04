import React from 'react';
import './CommandBox.css';
import {ButtonToolbar, Button} from 'react-bootstrap';

export default class CommandBox extends React.Component {
    componentWillUpdate() {
        this.needToScroll = this.consoleDOM.scrollTop + this.consoleDOM.offsetHeight === this.consoleDOM.scrollHeight;
    }

    componentDidUpdate () {
        if (this.needToScroll) {
            this.consoleDOM.scrollTop = this.consoleDOM.scrollHeight;
        }
    }

    render() {
        const output = this.props.output.map((line, i) => (
            <p key={i}>{line}</p>
        ));

        return (
            <div className="output-console">
                <h2>{this.props.command}</h2>
                <div className="console-scroll" ref={input => this.consoleDOM = input}>                    
                    {output}
                </div>
                <ButtonToolbar>
                    <Button bsStyle="danger" disabled={!this.props.isRunning} onClick={() => this.props.killProcess(this.props.command)}>Kill Process</Button>
                    <Button onClick={() => this.props.hideBox(this.props.command)}>Close Command Box</Button>
                </ButtonToolbar>
            </div>
        )
    }
}