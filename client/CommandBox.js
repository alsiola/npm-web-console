import React from 'react';

export default class CommandBox extends React.Component {
    render() {
        const output = this.props.output.map((line, i) => (
            <p key={i}>{line}</p>
        ));

        return (
            <div>
                <h2>{this.props.command}</h2>
                {output}
            </div>
        )
    }
}