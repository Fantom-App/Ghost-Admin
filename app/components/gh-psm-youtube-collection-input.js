import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { sort } from "@ember/object/computed";

export default Component.extend({
    store: service(),

    // public attrs
    series: null,
    tagName: "",

    // internal attrs
    _availableTags: null,

    availableTags: sort("_availableTags.[]", function (tagA, tagB) {
        // ignorePunctuation means the # in internal tag names is ignored
        return tagA.name.localeCompare(tagB.name, undefined, {
            ignorePunctuation: true,
        });
    }),

    availableTagNames: computed("availableTags.@each.name", function () {
        return this.availableTags.map((tag) => tag.name.toLowerCase());
    }),

    init() {
        this._super(...arguments);
        // perform a background query to fetch all users and set `availableTags`
        // to a live-query that will be immediately populated with what's in the
        // store and be updated when the above query returns
        this.store.query("tag", { limit: "all" });
        this.set(
            "_availableTags",
            this.store.peekAll("tag").filterBy("type", "collection")
        );

        const selected = this.store
            .peekAll("tag")
            .findBy("id", this.series.collection);

        this.set("selectedCollection", selected ? [selected] : []);
        this.set("series.tags", selected ? [selected] : []);

        console.log(
            "this.store.peek :>> ",
            this.store.peekAll("tag").filterBy("type", "collection")
        );
    },

    actions: {
        matchTags(tagName, term) {
            return tagName.toLowerCase() === term.trim().toLowerCase();
        },

        hideCreateOptionOnMatchingTag() {
            return false;
        },

        updateTags(newTags) {
            const tag = newTags[0];
            console.log("tag :>> ", tag);
            console.log('this.get("tag.id") :>> ', tag.get("id"));

            this.update(tag.get("id"));

            return this.set("selectedCollection", newTags);
        },

        createTag(tagName) {
            console.log("tagName :>> ", tagName);
            const selected = this.store
                .peekAll("tag")
                .findBy("id", this.get("series.collection"));

            let currentTagName = selected.get("name").toLowerCase();

            let tagToAdd;

            tagName = tagName.trim();

            // abort if tag is already selected
            if (currentTagName === tagName.toLowerCase()) {
                return;
            }

            // find existing tag if there is one
            tagToAdd = this._findTagByName(tagName);

            // create new tag if no match
            if (!tagToAdd) {
                return;
            }

            // push tag onto series relationship
            return [tagToAdd];
        },
    },

    // methods

    _findTagByName(name) {
        let withMatchingName = function (tag) {
            return tag.name.toLowerCase() === name.toLowerCase();
        };
        return this.availableTags
            .find(withMatchingName)
            .filterBy("type", "collection");
    },
});
