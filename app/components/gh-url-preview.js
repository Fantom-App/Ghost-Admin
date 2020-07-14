import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

/*
Example usage:
{{gh-url-preview prefix="tag" slug=theSlugValue tagName="p" classNames="description"}}
*/
export default Component.extend({
    config: service(),

    classNames: 'ghost-url-preview',
    prefix: null,
    slug: null,
    visibility: null,

    url: computed('slug', 'prefix', 'visibility', function () {
        // Get the blog URL and strip the scheme
        let staticSiteUrl = this.get('config.staticSiteUrl');
        // Remove `http[s]://`
        let noSchemestaticSiteUrl = staticSiteUrl.substr(staticSiteUrl.indexOf('://') + 3);

        // Get the prefix and slug values
        let prefix = this.prefix ? `${this.prefix}/` : '';
        let slug = this.slug ? `${this.slug}/` : '';
        let isPublic = this.visibility === 'public' ? 'public/' : '';

        // Join parts of the URL together with slashes
        let theUrl = `${noSchemestaticSiteUrl}/${isPublic}${prefix}${slug}`;

        return theUrl;
    })
});
