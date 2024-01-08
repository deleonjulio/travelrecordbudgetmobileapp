/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import {useState, useRef} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import { moneyFormat } from '../../utils/helper';
import CurrencyInput from 'react-native-currency-input';
import { DatePicker } from '../../components';

export const CreateTransactionScreen = () => {
    const inputRef = useRef(null)
    const [value, setValue] = useState(0);
    const [transactionDate, setTransactionDate] = useState(new Date())

    return (
        <View style={styles.container}>
            <View style={styles.amountContainer}>
                <CurrencyInput
                    ref={inputRef}
                    onLayout={() => inputRef.current.focus()}
                    style={styles.input}
                    value={value ? value : 0}
                    onChangeValue={setValue}
                    prefix='$'
                    delimiter=","
                    separator="."
                    precision={2}
                    minValue={0}
                />
            </View>
            <View style={[styles.inputContainer, styles.categoryContainer]}>

            </View>
            <View style={styles.inputContainer}>
                <DatePicker value={transactionDate} setValue={setTransactionDate} />
            </View>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholderTextColor="gray"
                    style={styles.description}
                    placeholder="Add a description"
                    maxHeight={verticalScale(70)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    amountContainer: {
        paddingTop: verticalScale(40),
        paddingBottom: verticalScale(16),
        alignItems: 'center',
    },
    input: {
        fontSize: moderateScale(44),
        fontWeight: '500',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '90%',
        textAlign: 'center',
        padding: 0,
    },
    inputContainer: {
        // paddingVertical: verticalScale(8),
        alignItems: 'center',
    },
    description: {
        backgroundColor: 'white',
        fontSize: moderateScale(17),
        textAlignVertical: 'top',
        width: '90%',
        paddingHorizontal: moderateScale(16),
        fontFamily: 'Muli-Bold',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(8)
    },
    categoryContainer: {
        backgroundColor: 'white',
        paddingVertical: verticalScale(40),
        width: '90%',
    }
});
