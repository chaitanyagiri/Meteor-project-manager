import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.js';
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
     
        Meteor.call('projects.insert', text);
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
            return filteredProjects.map((project) => {
                const currentUserId = this.props.currentUser && this.props.currentUser._id;
                const showPrivateButton = project.owner === currentUserId;
                return(
                <Project key={project._id} project={project} showPrivateButton={showPrivateButton}/>
                );
            });
        
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
                        Hide Completed Projects
                    </label>
                        <AccountsUIWrapper />
                        { this.props.currentUser ?
                            <form className="new-project" onSubmit={this.handleSubmit.bind(this)} >
                                <input
                                type="text"
                                ref="textInput"
                                placeholder="Type to add new projects"
                                required
                                />
                                <input 
                                type="submit"
                                placeholder="Submit"
                                />
                            </form>: ''
                        }
                </header>
                <ul>
                    {this.renderProjects()}
                </ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('projects');
    return {
      projects: Projects.find({}, { sort: { createdAt: 1 } }).fetch(),
      uncompletedProjects: Projects.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    };
  })(App);
  