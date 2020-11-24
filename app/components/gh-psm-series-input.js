import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import {sort} from '@ember/object/computed';

export default Component.extend({

    store: service(),

    // public attrs
    post: null,
    tagName: '',

    // internal attrs
    _availableSeries: null,
    _post: null,

    availableSeries: sort('_availableSeries.[]', function (tagA, tagB) {
        // ignorePunctuation means the # in internal tag names is ignored
        return tagA.name.localeCompare(tagB.name, undefined, {ignorePunctuation: true});
    }),

    availableTagNames: computed('availableSeries.@each.name', function () {
        return this.availableSeries.map(tag => tag.name.toLowerCase());
    }),

    init() {
        this._super(...arguments);
        // perform a background query to fetch all users and set `availableSeries`
        // to a live-query that will be immediately populated with what's in the
        // store and be updated when the above query returns
        this.store.query('tag', {limit: 'all'}, {
            filter: {
                type: 'series'
            }
        });
        // this.set('_availableSeries', this.store.peekAll('tag'));
        this.set('_availableSeries', this.store.peekAll('tag').filterBy('type', 'series'));
        this.set('selectedSeries', this.post.tags.filterBy('type', 'series'));
    },

    actions: {
        matchTags(tagName, term) {
            return tagName.toLowerCase() === term.trim().toLowerCase();
        },

        hideCreateOptionOnMatchingTag() {
            return false;
        },

        updateTags(newTags) {
            let currentTags = this.get('post.tags');

            // destroy new+unsaved tags that are no longer selected
            currentTags.forEach(function (tag) {
                if (!newTags.includes(tag) && tag.get('isNew')) {
                    tag.destroyRecord();
                }
            });

            if (newTags[0]) {
                newTags = [newTags[newTags.length - 1]];
            }

            let missingTags = this.get('post.tags').filterBy('type', 'collection');
            let allTags = missingTags.concat(newTags);

            // update tags
            this.set('post.tags', allTags);
            return this.set('selectedSeries', this.post.tags.filterBy('type', 'series'));
        },

        createTag(tagName) {
            let currentTags = this.get('post.tags');
            let currentTagNames = currentTags.map(tag => tag.get('name').toLowerCase());
            let tagToAdd;

            tagName = tagName.trim();

            // abort if tag is already selected
            if (currentTagNames.includes(tagName.toLowerCase())) {
                return;
            }

            // find existing tag if there is one
            tagToAdd = this._findTagByName(tagName);

            // create new tag if no match
            if (!tagToAdd) {
                tagToAdd = this.store.createRecord('tag', {
                    name: tagName,
                    type: 'series'
                });

                // set to public/internal based on the tag name
                tagToAdd.updateVisibility();
            }

            // push tag onto post relationship
            return currentTags.pushObject(tagToAdd);
        }
    },

    // methods

    _findTagByName(name) {
        let withMatchingName = function (tag) {
            return tag.name.toLowerCase() === name.toLowerCase();
        };
        return this.availableSeries.find(withMatchingName).filterBy('type', 'series');
    }
});
