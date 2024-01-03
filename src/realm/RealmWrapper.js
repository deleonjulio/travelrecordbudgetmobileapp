import React from 'react';
import {createRealmContext} from '@realm/react';
import { AccountSettings, Budget, Category, Transaction, Theme, Biometric } from './Schema';

const key = new Int8Array(64); 

// Create a configuration object
const realmConfig = {
  schema: [AccountSettings, Budget, Category, Transaction, Theme, Biometric],
  encryptionKey: key,
  schemaVersion: 1
};

// Create a realm context
// {RealmProvider, useRealm, useObject, useQuery} 
export const RealmContext = createRealmContext(realmConfig);

// Expose a realm
export function RealmWrapper({children}) {
  return (
    <RealmContext.RealmProvider>
      {children}
    </RealmContext.RealmProvider>
  );
}
