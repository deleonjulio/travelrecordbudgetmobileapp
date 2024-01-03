import React, {useState, useRef, memo} from 'react';
import {View, StyleSheet} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import DropDownPicker from 'react-native-dropdown-picker';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import {colors} from '../../../config';

export const MainInput = memo(function MainInput({handleSubmitTransaction}) {
  const [amount, setAmount] = useState(0);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    const payload = {
      amount,
      categoryId: 'category',
    };

    handleSubmitTransaction(payload);
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);

  return (
    <View>
      <CurrencyInput
        style={styles.mainInput}
        ref={inputRef}
        value={amount}
        onChangeValue={setAmount}
        delimiter=","
        separator="."
        precision={2}
        minValue={0}
        maxValue={1000000000}
        onSubmitEditing={handleSubmit}
      />
      <View style={styles.categoryContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          listMode="MODAL"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  mainInput: {
    width: '100%',
    borderBottomWidth: moderateScale(0.5),
    borderBottomColor: colors.color2,
    fontSize: moderateScale(38),
    textAlign: 'center',
    color: colors.color2,
  },
  categoryContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },
});
