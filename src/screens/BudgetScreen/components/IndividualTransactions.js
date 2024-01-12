import { memo } from "react";
import { FlatList, TouchableOpacity, View, StyleSheet, Platform } from "react-native"
import { verticalScale, moderateScale, scale } from "react-native-size-matters"
import { moneyFormat } from "../../../utils/helper"
import { IconCard, Text} from "../../../components";

export const IndividualTransactions = memo(function IndividualTransactions({transactions, navigation, currency, isDarkMode = false}) {
  return (
    <FlatList
      bounces={false}
      showsVerticalScrollIndicator={false}
      data={transactions}
      keyExtractor={(item) => item._id}
      renderItem={({item}) => {
        return (
          <TouchableOpacity style={styles.individualTransactionContainer({isDarkMode})} onPress={() => {
            navigation.navigate('CreateTransactionScreen', {transactionId: item?._id.toString(), budgetId: item?.budgetId.toString()})
          }}>
            <View renderToHardwareTextureAndroid style={{flex: 0.6, flexDirection: 'row', alignItems: 'center', columnGap: scale(12)}}>
              <IconCard icon={item.icon} iconColor={item.iconColor} backgroundColor={item.backgroundColor} />
              <View style={{flex: 1}}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.description({isDarkMode})}>{item.description || '---'}</Text>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.categoryName({isDarkMode})}>{item.categoryName ? item.categoryName : '---'}</Text>
              </View>
            </View>
            <View style={{flex: 0.4, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.amount({isDarkMode})}>{`${currency ? currency : ''}${moneyFormat(item.amount)}`}</Text>
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
})

const styles = StyleSheet.create({
  individualTransactionContainer: ({isDarkMode = false}) => ({
    elevation: moderateScale(1),
    flexDirection: 'row',
    backgroundColor: isDarkMode ? 'black' : 'white',
    marginVertical: verticalScale(0.4),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    rowGap: verticalScale(4),
  }),
  categoryName: ({isDarkMode = false}) => ({
    color: isDarkMode ? '#7f7f7f' : 'gray',
    fontWeight: '400',
    fontSize: moderateScale(14),
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'}),
  }),
  description: ({isDarkMode = false}) => ({
    color: isDarkMode ? 'white' : 'black',
    fontWeight: '600',
    fontSize: moderateScale(16),
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  }),
  amount: ({isDarkMode = false}) => ({
    color: isDarkMode ? 'white' : 'black',
    fontWeight: '400',
    fontSize: moderateScale(15),
    ...(Platform.OS === 'android' && {fontFamily: 'Muli'}),
  })
})