import Realm from 'realm';

export class Category extends Realm.Object {
    static schema = {
        name: 'Category',
        properties: {
            _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
            name: 'string',
            icon: 'string',
            iconColor: 'string',
            backgroundColor: 'string',
            dateCreated: 'date',
        },
        primaryKey: '_id',
    };
}