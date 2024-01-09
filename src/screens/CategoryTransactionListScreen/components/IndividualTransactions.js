import { FlatList, TouchableOpacity, View, StyleSheet} from "react-native"
import { verticalScale, moderateScale, scale } from "react-native-size-matters"
import { moneyFormat } from "../../../utils/helper"
import { Text } from "../../../components"

export const IndividualTransactions = ({transactions, navigation, currency}) => {
  return (
    <FlatList
      bounces={false}
      showsVerticalScrollIndicator={false}
      data={transactions}
      keyExtractor={(item) => item._id}
      renderItem={({item}) => {
        return (
          <TouchableOpacity style={styles.individualTransactionContainer} onPress={() => {
            navigation.navigate('CreateTransactionScreen', {transactionId: item?._id.toString()})
          }}>
              <View style={{flex: 1}}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.description}>{item.description || '---'}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text style={styles.amount}>{`${currency}${moneyFormat(item.amount)}`}</Text>
              </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

  const styles = StyleSheet.create({
    individualTransactionContainer: {
      elevation: moderateScale(1),
      flexDirection: 'row',
      backgroundColor: 'white',
      marginVertical: verticalScale(0.4),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(18),
      rowGap: verticalScale(4),
    },
    description: {
      color: 'black',
      fontWeight: '400',
      fontSize: moderateScale(14),
    },
    amount: {
      color: 'black',
      fontWeight: '400',
      fontSize: moderateScale(14)
    },
})