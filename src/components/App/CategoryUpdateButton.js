import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';

export const CategoryUpdateButton = ({route}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
        onPress={() =>
        navigation.navigate('UpdateCategoryScreen', {
          categoryId: route.params?.categoryId,
        })
      }
    >
      <Icon name="square-edit-outline" color="black" size={moderateScale(24)} />
    </TouchableOpacity>
  );
};