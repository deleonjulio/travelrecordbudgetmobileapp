import RNDropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { colors } from '../config';

export const DropDownPicker = ({open, setOpen, value, setValue, items, setItems}) => {
  return (
    <RNDropDownPicker
      textStyle={styles.textStyle}
      style={styles.dropDownPicker}
      containerProps={{height: moderateScale(60)}}
      listItemLabelStyle={{fontSize: moderateScale(20)}}
      listItemContainerStyle={{height: verticalScale(50)}}
      selectedItemLabelStyle={{color: 'white'}}
      selectedItemContainerStyle={{backgroundColor: 'black'}}
      open={open}
      setOpen={setOpen}
      value={value}
      setValue={setValue}
      items={items}
      setItems={setItems}
      listMode="MODAL"
      modalAnimationType='fade'
    />
  )
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: moderateScale(16),
    fontWeight: '400',
    fontFamily: 'Muli',
  },
  dropDownPicker: {
    height: scale(32),
    borderColor: colors.inputBorder,
    backgroundColor: 'transparent',
    paddingHorizontal: moderateScale(14),
  }
});
