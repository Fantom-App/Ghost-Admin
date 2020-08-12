import Transform from '@ember-data/serializer/transform';

export default Transform.extend({
    deserialize(serialized) {
        if (serialized) {
            let [, user] = serialized.match(/(\S+)/);

            return `https://twitch.tv/${user}`;
        }
        return serialized;
    },

    serialize(deserialized) {
        if (deserialized) {
            let [, user] = deserialized.match(/(?:https:\/\/)(?:twitch\.tv)\/(?:#!\/)?(\w+\/?\S+)/mi);

            return user;
        }
        return deserialized;
    }
});
