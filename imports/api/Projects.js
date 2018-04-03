import {Mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Projects = new Mongo.Collection('Projects');

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
        Projects.remove(projectId);
    },

    'projects.setChecked'(projectId, setChecked){
        check(projectId,String);
        check(setChecked,Boolean);
        
        Projects.update(projectId,{
            $set: { checked: setChecked }
        });
    }
});