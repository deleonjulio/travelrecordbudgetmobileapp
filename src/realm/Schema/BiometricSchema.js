import Realm from 'realm';

export class Biometric extends Realm.Object {
    static schema = {
        name: 'Biometric',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            useBiometric: 'bool',
        },
        primaryKey: '_id',
    };
}