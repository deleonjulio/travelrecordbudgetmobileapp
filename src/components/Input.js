import React from 'react';
import {TextInput, StyleSheet, Platform} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {colors} from '../config';

export const Input = React.forwardRef(
  ({value, setValue, placeholder, keyboardType, ...rest}, ref) => {
    return (
      <TextInput
        {...rest}
        ref={ref}
        style={[styles.input, rest.style]}
        onChangeText={setValue}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={"gray"}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    color: 'black',
    borderWidth: verticalScale(1),
    borderRadius: verticalScale(8),
    borderColor: colors.inputBorder,
    fontSize: moderateScale(16),
    fontWeight: '400',
    paddingHorizontal: moderateScale(14),
    marginBottom: verticalScale(16),
    height: moderateScale(46),
    fontFamily: 'Muli'
  },
});
