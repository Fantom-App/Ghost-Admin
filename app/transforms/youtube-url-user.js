import Transform from '@ember-data/serializer/transform';

export default Transform.extend({
    deserialize(serialized) {
        if (serialized) {
            let [, user] = serialized.match(/(\S+)/);

            return `https://youtube.com/${user}`;
        }
        return serialized;
    },

    serialize(deserialized) {
        if (deserialized) {
            let [, user] = deserialized.match(/(?:https:\/\/)(?:youtube\.com)\/(?:#!\/)?(\w+\/?\S+)/mi);

            return user;
        }
        return deserialized;
    }
});
