import React, { Component } from 'react';
import { Projects } from '../api/Projects.js';
import classnames from 'classnames';
// project component - represents a single todo item
class Project extends Component {
  tickChecked(){
    Meteor.call('projects.setChecked', this.props.project._id, !this.props.project.checked);
  }
  deleteThisProject() {
    Meteor.call('projects.remove', this.props.project._id);
  }
  togglePrivate() {
    Meteor.call('projects.setPrivate', this.props.project._id, !this.props.project.private);
  }

  render() {
    const projectClassName = classnames({
      checked: this.props.project.checked,
      private: this.props.project.private,
    });
    return (
      <li className={projectClassName}>
        <button className="delete" onClick={this.deleteThisProject.bind(this)}>
            &times;
        </button>
        <input
            type="checkbox"
            readOnly
            checked={this.props.project.checked}
            onClick={this.tickChecked.bind(this)}
        />
        { this.props.showPrivateButton ? (
            <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
              { this.props.project.private ? 'Private' : 'Public' }
            </button>
        ) : ''}
        <span className="text">
          <strong>{this.props.project.username}</strong>: {this.props.project.text}
        </span>
      </li>
    );
  }
}
export default Project;