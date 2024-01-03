import Realm from 'realm';

export class Theme extends Realm.Object {
    static schema = {
        name: 'Theme',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            theme: 'string',
        },
        primaryKey: '_id',
    };
}