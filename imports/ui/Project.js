import React, { Component } from 'react';
import { Projects } from '../api/Projects.js';
// Task component - represents a single todo item
class Project extends Component {
  tickChecked(){
    Meteor.call('projects.setChecked', this.props.project._id, !this.props.project.checked);
  }
  deleteThisProject() {
    Meteor.call('projects.remove', this.props.project._id);
  }
  render() {
    const taskClassName = this.props.project.checked ? 'checked' : '';
    return (
      <li>
      <button className="delete" onClick={this.deleteThisProject.bind(this)}>
          &times;
      </button>
      <input
          type="checkbox"
          readOnly
          checked={this.props.project.checked}
          onClick={this.tickChecked.bind(this)}
      />
      <span className="text">
        <strong>{this.props.project.username}</strong>: {this.props.project.text}
      </span>
      </li>
    );
  }
}
export default Project;