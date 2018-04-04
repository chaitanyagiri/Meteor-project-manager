import {Mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Projects = new Mongo.Collection('Projects');

if (Meteor.isServer) {
    Meteor.publish('projects', function projectsPublication() {
        return Projects.find({
            $or: [
                    { private: { $ne: true } },
                    { owner: this.userId },
                ],
        });
    });
}

Meteor.methods({
    'projects.insert'(text) {
        check(text, String);

        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Projects.insert({
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
       
    },
    
    'projects.remove'(projectId) {
        check(projectId, String);

        const project = Projects.findOne(taskId);
        if (project.private && project.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Projects.remove(projectId);
    },

    'projects.setChecked'(projectId, setChecked){
        check(projectId,String);
        check(setChecked,Boolean);
        
        const project = Projects.findOne(taskId);
        if (project.private && project.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Projects.update(projectId,{
            $set: { checked: setChecked }
        });
    },
    'projects.setPrivate'(projectId, setToPrivate) {
        check(projectId, String);
        check(setToPrivate, Boolean);
        
        const project = Projects.findOne(projectId);
        if (project.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        Projects.update(projectId, { $set: { private: setToPrivate } });
        
    },
});