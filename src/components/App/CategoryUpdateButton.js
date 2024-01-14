import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import Realm from 'realm';
import { RealmContext } from '../../realm/RealmWrapper';
import { determineTextColor } from '../../utils/helper';
import { Category } from '../../realm/Schema';

export const CategoryUpdateButton = ({route}) => {
  const navigation = useNavigation();
  const {useObject} = RealmContext;

  const categoryData = useObject(Category, new Realm.BSON.ObjectId(route.params?.categoryId));

  return (
    <TouchableOpacity
        onPress={() =>
        navigation.navigate('UpdateCategoryScreen', {
          categoryId: route.params?.categoryId,
        })
      }
    >
      <Icon name="square-edit-outline" color={categoryData?.iconColor ? determineTextColor(categoryData?.iconColor) : 'black'} size={moderateScale(24)} />
    </TouchableOpacity>
  );
};