import { memo, useEffect, useState } from "react";
import { StyleSheet, Modal, View, TouchableOpacity  } from "react-native";
import { verticalScale, moderateScale, scale } from "react-native-size-matters";
import { colors } from "../config";
import {Calendar as RNCalendar, CalendarUtils} from 'react-native-calendars';
import { Text } from ".";
import dayjs from "dayjs";

export const Calendar = memo(function Calender({show, setShow, date, setDate}) {
    const getStartDate = (data) => {
        const startingDayKey = data && Object.keys(data).find(
          (key) => data[key].startingDay === true
        );
      
        return startingDayKey || null;
    }

    const getEndDate = (data) => {
        const endingDayKey = data && Object.keys(data).find(
          (key) => data[key].endingDay === true
        );
      
        return endingDayKey || null;
    }

    const getDate = (count) => {
        const date = new Date(getStartDate(calendarDate));
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };
    
    const [calendarDate, setCalendarDate] = useState(null)

    const checkStartingDay = (data) => {
        if(data && Object.values(data).some((day) => day.startingDay === true)) {
            return true
        }

        return false
    }

    const checkEndingDay = (data) => {
        if(data && Object.values(data).some((day) => day.endingDay === true)) {
            return true
        }

        return false
    }


    const disableDate = () => {
        const startingDayExist = checkStartingDay(calendarDate);
        const endingDayExist = checkEndingDay(calendarDate);

        if(startingDayExist && endingDayExist) {
            return null
        } else {
            return getStartDate(calendarDate)
        }
        
    }

    const handleDateSelection = (dateString) => {
        const startingDayExist = checkStartingDay(calendarDate);
        const endingDayExist = checkEndingDay(calendarDate);

        if(startingDayExist && endingDayExist) {
            setCalendarDate({[dateString]: {startingDay: true, color: 'black', textColor: 'white'}})
        } else {
            if(!startingDayExist) {
                return setCalendarDate({[dateString]: {startingDay: true, color: 'black', textColor: 'white'}})
            }
            
            if(startingDayExist) {
                const startingDay = getStartDate(calendarDate)
            
                if(startingDay === dateString) {
                    return setCalendarDate({[dateString]: {startingDay: true, endingDay: true, color: 'black', textColor: 'white'}})
                }

                const dayDifference = dayjs(dateString).diff(dayjs(startingDay), 'day');
                let datesBetween = {}
                for (let index = 1; index < dayDifference; index++) {
                    datesBetween[getDate(index)] = {color: 'gray', textColor: 'white'}
                }
                
                // console.log(startingDay, 'start')
                // console.log(JSON.stringify(datesBetween, undefined, 2), 'between')
                // console.log(dateString, 'end')

                return setCalendarDate({
                    [startingDay]: {startingDay: true, color: 'black', textColor: 'white'},
                    ...datesBetween,
                    [dateString]: {endingDay: true, color: 'black', textColor: 'white'}
                })
            }
        }
    }

    const handleSelectedDate = () => {
        const startingDayExist = checkStartingDay(calendarDate);
        const endingDayExist = checkEndingDay(calendarDate);
        if(startingDayExist && endingDayExist) {
            setShow(false)
            const startDate = getStartDate(calendarDate)
            const endDate = getEndDate(calendarDate)
            setDate([dayjs(startDate).startOf('day'), dayjs(endDate).endOf('day')])
        }
    }

    const closeCalender = () => {
        setCalendarDate(null)
        setShow(false)
    }

    useEffect(() => {
        const handleInitialDate = () => {
            if(dayjs(date[1]).format('YYYY-MM-DD') === dayjs(date[0]).format('YYYY-MM-DD')) {
                return setCalendarDate({[dayjs(date[0]).format('YYYY-MM-DD')]: {startingDay: true, endingDay: true, color: 'black', textColor: 'white'}})
            }

            const dayDifference = dayjs(date[1]).diff(dayjs(date[0]), 'day');
            let datesBetween = {}
            for (let index = 1; index < dayDifference; index++) {
                datesBetween[getDate(index)] = {color: 'gray', textColor: 'white'}
            }

            setCalendarDate({
                [dayjs(date[0]).format('YYYY-MM-DD')]: {startingDay: true, color: 'black', textColor: 'white'},
                ...datesBetween,
                [dayjs(date[1]).format('YYYY-MM-DD')]: {endingDay: true, color: 'black', textColor: 'white'}
            })
        }

        if(date !== null) {
            handleInitialDate()
        }
    }, [show])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => setShow(true)}
            >
            <Text style={styles.text}>
                {date !== null && `${dayjs(date[0]).format('MMM DD, YYYY').toString()} to ${dayjs(date[1]).format('MMM DD, YYYY').toString()}`}
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
                            initialDate={getStartDate(calendarDate)}
                            minDate={disableDate()}
                            markingType={'period'}
                            markedDates={calendarDate}
                            theme={{
                                textInactiveColor: '#a68a9f',
                                textSectionTitleDisabledColor: 'grey',
                                textSectionTitleColor: 'black',
                                arrowColor: 'black',
                                textMonthFontWeight: '600',
                                textMonthFontFamily: 'Muli-Bold',
                                textDayFontSize: moderateScale(17),
                                textMonthFontSize: moderateScale(17),
                                // textDayHeaderFontSize: moderateScale(14),
                            }}
                            onDayPress={(day) => handleDateSelection(day.dateString)}
                        />
                        <View style={styles.modalFooter}>
                            <TouchableOpacity onPress={() => closeCalender()} style={{backgroundColor: 'white', padding: moderateScale(8), backgroundColor: 'lightgray', borderRadius: moderateScale(4)}}>
                                <Text style={styles.calendarButton}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSelectedDate()} style={{backgroundColor: 'white', padding: moderateScale(8), backgroundColor: 'lightgray', borderRadius: moderateScale(4)}}>
                                <Text style={styles.calendarButton}>Confirm</Text>
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
        padding: moderateScale(10)
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
    calendarButton: {fontSize: moderateScale(14), fontFamily: 'Muli-Bold'},
    modalFooter: {flexDirection: 'row', justifyContent: 'space-around', paddingVertical: verticalScale(10), backgroundColor: 'white'}
  });
  