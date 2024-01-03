import Realm from 'realm';

export class Transaction extends Realm.Object {
    static schema = {
        name: 'Transaction',
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            budgetId: 'objectId',
            categoryId: { type: 'objectId', optional: true },
            amount: 'int',
            description: 'string',
            transactionDate: 'date',
            dateCreated: 'date',
        },
        primaryKey: '_id',
    };
}