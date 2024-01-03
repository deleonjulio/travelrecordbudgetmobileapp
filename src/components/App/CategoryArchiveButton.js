import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import { RealmContext } from '../../realm/RealmWrapper';
import { Category } from '../../realm/Schema';
import Realm from 'realm';

export const CategoryArchiveButton = ({route}) => {
  const navigation = useNavigation();
  const { useRealm, useObject } = RealmContext
  const realm = useRealm()
  const categoryToBeArchive = useObject(Category, new Realm.BSON.ObjectId(route.params.categoryId));

  const archiveCategory = () => {
    realm.write(() => {
      realm.delete(categoryToBeArchive);
      navigation.navigate('CategoryScreen');
    });
  }

  const confirmArchive = () =>
    Alert.alert('Archive', 'Are you sure you want to archive this category?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: archiveCategory,
        style: 'destructive'
      },
    ]);

  return (
    <TouchableOpacity onPress={confirmArchive}>
      <Icon name="delete" color="black" size={moderateScale(24)} />
    </TouchableOpacity>
  );
};
