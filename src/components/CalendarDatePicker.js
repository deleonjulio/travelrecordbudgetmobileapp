import { memo, useEffect, useState, useMemo } from "react";
import { StyleSheet, Modal, View, TouchableOpacity  } from "react-native";
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { colors } from "../config";
import {Calendar as RNCalendar} from 'react-native-calendars';
import { Text } from ".";
import dayjs from "dayjs";

export const CalendarDatePicker = memo(function CalendarDatePicker({value, setValue}) {
    const [show, setShow] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)

    const closeCalender = () => {
        setSelectedDate(null)
        setShow(false)
    }

    const marked = useMemo(() => {
        return {
            [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'black',
                selectedTextColor: 'white'
            }
        };
    }, [selectedDate]);

    const onDayPress = (date) =>  setSelectedDate(date.dateString)

    const handleSelectedDate = () => {
        setValue(dayjs(selectedDate))
        closeCalender()
    }

    useEffect(() => {
        if(show) {
            setSelectedDate(dayjs(value).format('YYYY-MM-DD'))
        }
    }, [show])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => setShow(true)}
            >
            <Text style={styles.text}>
                {value !== null && `${dayjs(value).format('YYYY-MM-DD').toString()}`}
            </Text>
            </TouchableOpacity>
            <View>
                <Modal
                    visible={show}
                    animationType="fade"
                    onRequestClose={() => setShow(false)}
                    transparent={true}
                >
                    <View style={styles.centeredView}>
                        <RNCalendar
                            style={{borderTopRightRadius: 10, borderTopLeftRadius: 10}}
                            enableSwipeMonths
                            theme={styles.calendar}
                            onDayPress={onDayPress}
                            markedDates={marked}
                        />
                        <View style={styles.modalFooter}>
                            <TouchableOpacity onPress={() => closeCalender()} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSelectedDate()} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
})

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: moderateScale(10),
    },
    btn: {height: '100%', justifyContent: 'center', width: '100%'},
    container: {
        borderRadius: verticalScale(8),
        borderWidth: 1,
        borderColor: colors.inputBorder,
        height: moderateScale(46),
        marginBottom: moderateScale(14),
    },
    text: {
        fontSize: moderateScale(16),
        fontWeight: '400',
        paddingHorizontal: moderateScale(14),
        color: 'black',
        fontFamily: 'Muli'
    },
    calendar: {
        textInactiveColor: '#a68a9f',
        textSectionTitleDisabledColor: 'grey',
        textSectionTitleColor: 'black',
        arrowColor: 'black',
        textMonthFontWeight: '600',
        textMonthFontFamily: 'Muli-Bold',
        textDayFontSize: moderateScale(17),
        textMonthFontSize: moderateScale(17),
    },
    modalFooter: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingVertical: verticalScale(10),
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white', 
        paddingVertical: scale(8),
        marginLeft: scale(16),
        marginRight: scale(6),
        borderColor: 'gray',
        borderWidth: moderateScale(0.5),
        borderRadius: moderateScale(8)
    },
    cancelButtonText: {fontSize: moderateScale(15), fontFamily: 'Muli-Bold', color: 'black'},
    confirmButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black', 
        paddingVertical: scale(8),
        marginLeft: scale(6),
        marginRight: scale(16),
        borderColor: 'gray',
        borderWidth: moderateScale(0.5),
        borderRadius: moderateScale(8)
    },
    confirmButtonText: {fontSize: moderateScale(15), fontFamily: 'Muli-Bold', color: 'white'},
  });
  