/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Projects } from './Projects.js';
import { assert } from 'chai';

if (Meteor.isServer) {
    describe('Projects', () => {
        describe('methods', () => {
            const userId = Random.id();
            let projectId;
            beforeEach(() => {
                Projects.remove({});
                projectId = Projects.insert({
                    text: 'test project',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'tmeasday',
                });
            });
            it('can delete owned project', () => {
                // Find the internal implementation of the project method so we can
                // test it in isolation
                const deleteproject = Meteor.server.method_handlers['projects.remove'];
                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };
                // Run the method with `this` set to the fake invocation
                deleteproject.apply(invocation, [projectId]);
                // Verify that the method does what we expected
                assert.equal(Projects.find().count(), 0);
            });
        });
    });
}
