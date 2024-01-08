import { forwardRef  } from 'react';
import RNCurrencyInput from 'react-native-currency-input';
import { StyleSheet } from 'react-native';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { colors } from '../config';

export const CurrencyInput = forwardRef(({value, onChangeValue, ...rest}, ref) => {
    return <RNCurrencyInput
      ref={ref}
      style={styles.currencyInput}
      value={value}
      onChangeValue={onChangeValue}
      delimiter=","
      separator="."
      precision={2}
      minValue={0}
      maxValue={1000000000000}
      placeholder="Amount"
      {...rest}
  />
})

const styles = StyleSheet.create({
  currencyInput: {
    backgroundColor: 'white',
    color: 'black',
    borderWidth: verticalScale(1),
    borderRadius: moderateScale(8),
    borderColor: colors.inputBorder,
    fontSize: moderateScale(16),
    fontWeight: '400',
    paddingHorizontal: moderateScale(14),
    marginBottom: verticalScale(14),
    // paddingVertical: scale(10)
    height: moderateScale(46),
    fontFamily: 'Muli'
  },
})