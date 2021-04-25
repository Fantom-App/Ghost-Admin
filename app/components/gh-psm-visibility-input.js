import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default Component.extend({
    settings: service(),
    config: service(),

    // public attrs
    post: null,

    selectedVisibility: computed("post.visibility", function () {
        return (
            this.get("post.visibility") ||
            this.settings.get("defaultContentVisibility")
        );
    }),

    init() {
        console.log("object");
        this._super(...arguments);
        this.get("createVisibilities");
    },

    createVisibilities: computed(
        "config.tiers.tier1",
        "config.tiers.tier2",
        function () {
            this.availableVisibilities = [
                { label: "Public", name: "public" },
                { label: this.get("config.tiers.tier1"), name: "members" },
                { label: this.get("config.tiers.tier2"), name: "paid" },
            ];
        }
    ),

    actions: {
        updateVisibility(newVisibility) {
            this.post.set("visibility", newVisibility);
        },
    },
});
