import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Project from './Project.js';

import { Projects } from '../api/Projects.js';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideCompleted: false,
        };     
    }
    handleSubmit(event) {
        event.preventDefault();
     
        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
     
        Projects.insert({
          text,
          createdAt: new Date(), // current time
        });
     
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }
    toggleHideCompleted(){
        let checkstatus = this.state.hideCompleted;
        this.setState({
            hideCompleted: !checkstatus,
        });
    }
    renderProjects() {
        let filteredProjects = this.props.projects;
        if (this.state.hideCompleted) {
            filteredProjects = filteredProjects.filter(project => !project.checked);
        }
        return filteredProjects.map((project) => (
            <Project key={project._id} project={project} />
        ));
    }
    render() {
        return (
            <div className="container">
            <header>
                <h1>ProjectManager ({this.props.uncompletedProjects} Uncompleted)</h1>
            <label className="hide-completed">
                <input
                    type="checkbox"
                    readOnly
                    checked={this.state.hideCompleted}
                    onClick={this.toggleHideCompleted.bind(this)}
                />
                Hide Completed Tasks
            </label>
                <form className="new-project" onSubmit={this.handleSubmit.bind(this)} >
                    <input
                    type="text"
                    ref="textInput"
                    placeholder="Type to add new projects"
                    />
                    <input 
                    type="submit"
                    placeholder="Submit"
                    />
                </form>
            </header>
            <ul>
                {this.renderProjects()}
            </ul>
            </div>
        );
    }
}

export default withTracker(() => {
    return {
      projects: Projects.find({}, { sort: { createdAt: 1 } }).fetch(),
      uncompletedProjects: Projects.find({ checked: { $ne: true } }).count()
    };
  })(App);
  