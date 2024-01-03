import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale, moderateScale, verticalScale} from 'react-native-size-matters';
import { Typography, Input, IconCard } from '../../components';
import { CategoryModal } from '../CreateCategoryScreen/components/CategoryModal';
import { RealmContext } from '../../realm/RealmWrapper';
import { Category } from '../../realm/Schema';
import Realm from 'realm';

export const UpdateCategoryScreen = ({route, navigation}) => {
  const {categoryId} = route.params;

  const { useRealm, useObject } = RealmContext
  const realm = useRealm()
  const categoryToBeUpdated = useObject(Category, new Realm.BSON.ObjectId(categoryId));

  const [categoryName, setCategoryName] = useState(categoryToBeUpdated.name);
  const [selectedIcon, setSelectedIcon] = useState(categoryToBeUpdated.icon)
  const [selectedColor, setSelectedColor] = useState({
    iconColor: categoryToBeUpdated.iconColor,
    backgroundColor: categoryToBeUpdated.backgroundColor
  })
  const [showIcon, setShowIcon] = useState(false)

  const onSubmit = async () => {
    if (categoryToBeUpdated) {
      realm.write(() => {
        categoryToBeUpdated.name = categoryName
        categoryToBeUpdated.icon = selectedIcon
        categoryToBeUpdated.iconColor = selectedColor.iconColor
        categoryToBeUpdated.backgroundColor = selectedColor.backgroundColor
        navigation.goBack();
      });
    }
  };

  return (
    <View style={styles.container}>
      <Typography text="Name" type="text-input" />
      <Input setValue={setCategoryName} value={categoryName} />
      <Typography text="Icon" type="text-input" />
      <TouchableOpacity  style={{flexDirection: 'row', paddingBottom: verticalScale(12)}} onPress={() => setShowIcon(true)}>
        <View renderToHardwareTextureAndroid>
          <IconCard icon={selectedIcon} iconColor={selectedColor.iconColor} backgroundColor={selectedColor.backgroundColor} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <CategoryModal show={showIcon} setShow={setShowIcon} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} selectedColor={selectedColor} setSelectedColor={setSelectedColor}  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: moderateScale(16),
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'black',
    padding: moderateScale(12),
    borderRadius: moderateScale(6),
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontFamily: 'Muli-Bold'
  },
  icon: {
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(58),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(10),
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(0.5), 
    borderColor: 'gray',
    elevation: moderateScale(2)
  }
});

