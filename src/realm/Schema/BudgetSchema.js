import Realm from 'realm';

export class Budget extends Realm.Object {
    static schema = {
        name: 'Budget',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            name: 'string',
            amount: 'int',
            currency: 'string?',
            selected: 'bool',
            startDate: 'date',
            endDate: 'date',
            dateCreated: 'date',
            archived: 'bool'
        },
        primaryKey: '_id',
    };
}