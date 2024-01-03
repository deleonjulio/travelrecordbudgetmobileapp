import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import { Text } from '.';

export const Typography = ({text, type}) => {
  const getTextType = () => {
    switch (type) {
      case 'text-input':
        return styles.textInput;

      default:
        break;
    }
  };

  return <Text style={[styles.text, getTextType()]}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    marginBottom: verticalScale(4),
  },
  textInput: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: 'black',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'}),
  },
});
