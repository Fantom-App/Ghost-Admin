import Transform from '@ember-data/serializer/transform';

export default Transform.extend({
    deserialize(serialized) {
        if (serialized) {
            let [, user] = serialized.match(/(\S+)/);

            return `https://instagram.com/${user}`;
        }
        return serialized;
    },

    serialize(deserialized) {
        if (deserialized) {
            let [, user] = deserialized.match(/(?:https:\/\/)(?:instagram\.com)\/(?:#!\/)?(\w+\/?\S+)/mi);

            return user;
        }
        return deserialized;
    }
});
