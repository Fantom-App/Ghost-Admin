import createComponentCard from '../utils/create-component-card';

// map card names to component names
export const CARD_COMPONENT_MAP = {
    hr: 'koenig-card-hr',
    image: 'koenig-card-image',
    markdown: 'koenig-card-markdown',
    'card-markdown': 'koenig-card-markdown', // backwards-compat with markdown editor
    html: 'koenig-card-html',
    code: 'koenig-card-code',
    embed: 'koenig-card-embed',
    bookmark: 'koenig-card-bookmark',
    gallery: 'koenig-card-gallery',
    email: 'koenig-card-email',
    poll: 'koenig-card-poll',

};

// map card names to generic icons (used for ghost elements when dragging)
export const CARD_ICON_MAP = {
    hr: 'koenig/kg-card-type-divider',
    image: 'koenig/kg-card-type-image',
    markdown: 'koenig/kg-card-type-markdown',
    'card-markdown': 'koenig/kg-card-type-markdown',
    html: 'koenig/kg-card-type-html',
    code: 'koenig/kg-card-type-gen-embed',
    embed: 'koenig/kg-card-type-gen-embed',
    bookmark: 'koenig/kg-card-type-bookmark',
    gallery: 'koenig/kg-card-type-gallery',
    email: 'koenig/kg-card-type-gen-embed',
    poll: 'koenig/kg-card-type-poll',
};

// TODO: move koenigOptions directly into cards now that card components register
// themselves so that they are available on card.component
export default [
    createComponentCard('card-markdown'), // backwards-compat with markdown editor
    createComponentCard('code', {deleteIfEmpty: 'payload.code'}),
    createComponentCard('embed', {hasEditMode: false, deleteIfEmpty: 'payload.html'}),
    createComponentCard('bookmark', {hasEditMode: false, deleteIfEmpty: 'payload.metadata'}),
    createComponentCard('hr', {hasEditMode: false, selectAfterInsert: false}),
    createComponentCard('html', {deleteIfEmpty: 'payload.html'}),
    createComponentCard('image', {hasEditMode: false, deleteIfEmpty(card) {
        return card.payload.imageSelector && !card.payload.src;
    }}),
    createComponentCard('markdown', {deleteIfEmpty: 'payload.markdown'}),
    createComponentCard('gallery', {hasEditMode: false}),
    createComponentCard('email', {deleteIfEmpty: 'payload.html'}),
    createComponentCard('poll', {}),

];

export const CARD_MENU = [
    {
        title: 'Primary',
        items: [
            {
                label: 'YouTube',
                icon: 'koenig/kg-card-type-youtube',
                matches: ['youtube'],
                type: 'card',
                replaceArg: 'embed',
                params: ['url']
            },
            {
                label: 'Poll',
                icon: 'koenig/kg-card-type-poll',
                iconClass: 'kg-card-type-native',
                matches: ['poll'],
                type: 'card',
                replaceArg: 'poll',
                params: []
            },
            {
                label: 'Image',
                icon: 'koenig/kg-card-type-image',
                iconClass: 'kg-card-type-native',
                matches: ['image', 'img'],
                type: 'card',
                replaceArg: 'image',
                params: ['src'],
                payload: {
                    triggerBrowse: true
                }
            },
            {
                label: 'Divider',
                icon: 'koenig/kg-card-type-divider',
                iconClass: 'kg-card-type-native',
                matches: ['divider', 'horizontal-rule', 'hr'],
                type: 'card',
                replaceArg: 'hr'
            }
        ]
    }
];
