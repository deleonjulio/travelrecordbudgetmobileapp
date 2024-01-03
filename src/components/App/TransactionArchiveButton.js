import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import { RealmContext } from '../../realm/RealmWrapper';
import { Transaction } from '../../realm/Schema';
import Realm from 'realm';

export const TransactionArchiveButton = ({route}) => {
  const navigation = useNavigation();
  const { useRealm, useObject } = RealmContext
  const realm = useRealm()
  const transactionToBeArchive = useObject(Transaction, new Realm.BSON.ObjectId(route.params.transactionId));

  const archiveTransaction = () => {
    realm.write(() => {
      realm.delete(transactionToBeArchive);
      navigation.goBack();
    });
  }

  const confirmArchive = () =>
    Alert.alert('Delete Transaction', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: archiveTransaction,
        style: 'destructive',
      },
    ]);

  return (
    <TouchableOpacity onPress={confirmArchive}>
      <Icon name="delete" color="black" size={moderateScale(24)} />
    </TouchableOpacity>
  );
};