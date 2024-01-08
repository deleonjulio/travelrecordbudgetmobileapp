import { useState, memo } from 'react';
import {View, Text, Pressable, StyleSheet, Modal, Platform} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {colors} from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DatePicker = memo(function DatePicker({setValue, value}) {
  const [show, setShow] = useState(false);
  
  const onChange = (
    _event,
    selectedDate
  ) => {
    if (selectedDate === undefined) return;
    if(Platform.OS === 'android') {
      setShow(false)
    }
    setValue(selectedDate);
  };
  
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.btn}
        onPress={() => setShow(true)}
      >
        <Text style={styles.text}>
          {value && value.toISOString().split('T')[0]}
        </Text>
      </Pressable>
      {Platform.OS === 'ios' ? (
        <View>
          <Modal
            visible={show}
            animationType="fade"
            onRequestClose={() => setShow(false)}
            transparent={true}
          >
            <View style={styles.centeredView}>
              <DateTimePicker
                style={{backgroundColor: 'white'}}
                testID="dateTimePicker"
                value={value}
                mode={"date"}
                onChange={onChange}
                display="inline"
              />
              <Pressable onPress={() => setShow(false)} style={{backgroundColor: 'white', padding: 10, alignItems: 'flex-end'}}>
                <Text>OK</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
        ) : (
          show && <DateTimePicker
            testID="dateTimePicker"
            value={value}
            mode={"date"}
            onChange={onChange}
            display="inline"
          />
        )}
    </View>
  );

})

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  btn: {height: '100%', justifyContent: 'center', width: '100%'},
  container: {
    backgroundColor: 'whitesmoke',
    borderRadius: verticalScale(8),
    borderWidth: 1,
    borderColor: colors.inputBorder,
    height: moderateScale(46),
    marginBottom: verticalScale(16),
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: '400',
    paddingHorizontal: scale(12),
    color: 'black',
    fontFamily: 'Muli'
  },
});
