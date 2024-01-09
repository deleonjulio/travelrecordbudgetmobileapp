import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import { RealmContext } from '../../realm/RealmWrapper';
import { Budget } from '../../realm/Schema';
import Realm from 'realm';

export const BudgetArchiveButton = ({route}) => {
  const {budgetId} = route.params || {};

  const navigation = useNavigation();
  const { useRealm, useObject } = RealmContext
  const realm = useRealm()
  const budgetToBeArchive = useObject(Budget, new Realm.BSON.ObjectId(budgetId));

  const archiveBudget = () => {
    realm.write(() => {
      budgetToBeArchive.archived = true
      budgetToBeArchive.selected = false
      navigation.goBack();
    });
  }

  const confirmArchive = () =>
    Alert.alert('Delete', 'Are you sure you want to delete this budget?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Archive',
        onPress: archiveBudget,
        style: 'destructive',
      },
    ]);

  if(budgetId) {
    return (
      <TouchableOpacity onPress={confirmArchive}>
        <Icon name="delete" color="black" size={moderateScale(24)} />
      </TouchableOpacity>
    );
  }
};