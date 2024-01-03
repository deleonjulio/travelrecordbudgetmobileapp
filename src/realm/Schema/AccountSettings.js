import Realm from 'realm';

export class AccountSettings extends Realm.Object {
    static schema = {
        name: 'AccountSettings',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            useBiometric: 'bool',
            theme: 'string'
        },
        primaryKey: '_id',
    };
}