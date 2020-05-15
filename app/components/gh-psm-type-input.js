import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

const OPTIONS = [
    {label: 'Video', name: 'video'},
    {label: 'Blog', name: 'blog'}
];

export default Component.extend({

    settings: service(),

    // public attrs
    post: null,

    updateType() {},

    // selectedType: computed.reads('post.contentType'),

    selectedType: computed('post.contentType', function () {
        return this.get('post.contentType') || 'video';
    }),

    init() {
        this._super(...arguments);
        this.options = OPTIONS;
    },

    actions: {
        updateType(newType) {
            this.post.set('contentType', newType);
        }
    }
});
