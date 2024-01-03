import Realm from 'realm';

// Define your object model
export class Profile extends Realm.Object {
    static schema = {
        name: 'Profile',
        properties: {
            _id: 'objectId',
            name: 'string',
        },
        primaryKey: '_id',
    };
}