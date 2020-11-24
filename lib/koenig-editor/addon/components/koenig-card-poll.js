import Component from '@ember/component';
import {isEmpty} from '@ember/utils';
import layout from '../templates/components/koenig-card-poll';
import {run} from '@ember/runloop';
import {set} from '@ember/object';

export default Component.extend({
    layout,

    // attrs
    payload: null,
    isSelected: false,
    isEditing: false,

    // closure actions
    selectCard() {},
    deselectCard() {},
    editCard() {},
    saveCard() {},
    deleteCard() {},
    moveCursorToNextSection() {},
    moveCursorToPrevSection() {},
    addParagraphAfterCard() {},
    registerComponent() {},

    init() {
        this._super(...arguments);
        this.registerComponent(this);

        if (!this.payload.options) {
            this._updatePayloadAttr('options', ['']);
        }
    },

    actions: {
        leaveEditMode() {
            if (isEmpty(this.payload.options)) {
                // afterRender is required to avoid double modification of `isSelected`
                // TODO: see if there's a way to avoid afterRender
                run.scheduleOnce('afterRender', this, this.deleteCard);
            }
        },

        updateOption(index, event) {
            const newOptions = [...this.payload.options];
            newOptions[index] = event.target.value;
            this._updatePayloadAttr('options', newOptions);
        },

        addOption() {
            const newOptions = [...this.payload.options, '']
            this._updatePayloadAttr('options', newOptions);
        },

        removeOption(index) {
            const newOptions = [...this.payload.options];
            newOptions.splice(index, 1);
            this._updatePayloadAttr('options', newOptions);
        },

        toggleMultipleOptions() {
            this._updatePayloadAttr('multipleOptions', !this.payload.multipleOptions);
            console.log('this.payload :>> ', this.payload.multipleOptions);
        },

        optionKeydown(event, index) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }

            if (event.key === 'Escape') {
                event.target.blur();
            }
        },
    },

    _updatePayloadAttr(attr, value) {
        let payload = this.payload;
        let save = this.saveCard;

        set(payload, attr, value);

        // update the mobiledoc and stay in edit mode
        save(payload, false);
    }
});
