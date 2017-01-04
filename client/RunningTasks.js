import React from 'react';
import {Table, Button} from 'react-bootstrap';

export default class RunningTasks extends React.Component {
    getShowHideButton(task) {
        return (
            <Button onClick={() => this.props.toggleVisible(task.command, !task.visible)}>
                {task.visible ? "Hide" : "Show"}
            </Button>
        );
    }

    render() {
        const rows = this.props.tasks.map((task, i) => (
            <tr key={i}>
                <td>{task.command}</td>
                <td></td>
                <td>{task.isRunning ? "Running" : "Stopped"}</td>
                <td>{this.getShowHideButton(task)}</td>
            </tr>
        ));

        return (
            <div>
                <h4>Running Tasks</h4>
                <Table striped bordered condensed>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Started At</th>
                            <th>Status</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </div>
        )
    }
}