import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import 'react-native-get-random-values';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {Typography, Input, IconCard} from '../../components';
import { CategoryModal } from './components/CategoryModal';
import { ColorModal } from './components/ColorModal';
import { RealmContext } from '../../realm/RealmWrapper';

export const CreateCategoryScreen = ({navigation}) => {
  const nameRef = useRef(null);

  const { useRealm } = RealmContext
  const realm = useRealm()
  
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState({
    iconColor: 'black',
    backgroundColor: 'lightgray'
  })
  const [selectedIcon, setSelectedIcon] = useState('bank')
  const [showIcon, setShowIcon] = useState(false)
  const [showColor, setShowColor] = useState(false)

  const onSubmit = async () => {
    const newCategory = {
      ...selectedColor,
      name: categoryName,
      icon: selectedIcon,
      dateCreated: new Date(),
    };

    try {
      realm.write(() => {
        realm.create('Category', newCategory)
        navigation.goBack()
      });

    } catch (error) {
      console.log(error, 'Error create category')
    }
  };

  return (
      <View style={styles.container}>
        <Typography text="Name" type="text-input" />
        <Input ref={nameRef} setValue={setCategoryName} value={categoryName}  onLayout={() => nameRef.current.focus()}  />
        <Typography text="Icon" type="text-input" />
        <TouchableOpacity  style={{flexDirection: 'row', paddingBottom: verticalScale(12)}} onPress={() => setShowIcon(true)}>
          <View renderToHardwareTextureAndroid>
            <IconCard icon={selectedIcon} iconColor={selectedColor.iconColor} backgroundColor={selectedColor.backgroundColor} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <ColorModal show={showColor} setShow={setShowColor} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
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
  card: ({backgroundColor}) => ({
    padding: moderateScale(27), 
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(0.5), 
    borderColor: 'gray',
    // elevation: moderateScale(2),
    backgroundColor: backgroundColor
  }),
  // card:{
  //   // backgroundColor: '#fceaa1',
  //   backgroundColor: 'whitesmoke', 
  //   padding: moderateScale(27), 
  //   borderRadius: moderateScale(8),
  //   borderWidth: moderateScale(0.5), 
  //   borderColor: 'gray',
  //   elevation: moderateScale(2)
  // }
});

