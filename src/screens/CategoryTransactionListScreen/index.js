import { View, StyleSheet, FlatList, TouchableOpacity, Platform } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RealmContext } from "../../realm/RealmWrapper"
import { moneyFormat } from "../../utils/helper"
import { Category, Budget, Transaction } from "../../realm/Schema"
import Realm from "realm"
import { verticalScale, moderateScale, scale } from "react-native-size-matters"
import dayjs from "dayjs";
import { IndividualTransactions } from "./components/IndividualTransactions";
import { Text, IconCard } from "../../components";
import { NoTransactionFound } from "..";

export const CategoryTransactionListScreen = ({navigation, route}) => {
  const { useObject, useQuery } = RealmContext
  const { categoryId } = route?.params
  const { name: categoryName, icon: categoryIcon, iconColor, backgroundColor } = useObject(Category, new Realm.BSON.ObjectId(categoryId));

  const selectedBudget = useQuery(Budget, budgets => {
      return budgets.filtered('selected == $0 && archived == $1', true, false);
  })[0]

  const transactions = useQuery(Transaction, transaction => {
      return transaction.filtered('budgetId == $0 && categoryId == $1', new Realm.BSON.ObjectId(selectedBudget?._id), new Realm.BSON.ObjectID(categoryId)).sorted('dateCreated', true);
  })

  const totalExpense = transactions.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount;
  }, 0)

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = dayjs(transaction.transactionDate).format('YYYY-MM-DD');
    const dateInText =  dayjs(transaction.transactionDate).format('MMMM DD, YYYY');
    const existingGroup = acc.find(group => group.date === date);
  
    if (existingGroup) {
      existingGroup.totalExpense += transaction.amount;
      existingGroup.transactions.push(transaction);
    } else {
      acc.push({
        date: date,
        dateInText,
        totalExpense: transaction.amount,
        transactions: [transaction]
      });
    }
  
    return acc;
  }, []);

  groupedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const currency = selectedBudget?.currency ? selectedBudget.currency : ''

  return (
      <View style={{flex: 1}}>
          <View style={styles.topContainer}>
              <View style={styles.categoryContainer}>
                  <View style={styles.categoryContainerLeft}>
                      <View style={styles.card({backgroundColor})}>
                        <Icon name={categoryIcon ? categoryIcon: 'progress-question'} size={moderateScale(36)} color={iconColor} />
                      </View>
                  </View>
                  <View style={styles.categoryContainerRight}>
                      <Text style={styles.categoryName}>{categoryName}</Text>
                      <Text style={styles.categoryAmount}>{`${currency}${moneyFormat(totalExpense)}`}</Text>
                      <Text style={styles.transactionCount}>{`${transactions.length} transaction${transactions.length > 1 || transactions.length === 0 ? 's' : ''}`}</Text>
                  </View>
              </View>
          </View>
          <View style={styles.bottomContainer}>
            <FlatList
              ListEmptyComponent={<NoTransactionFound />}
              bounces={false}
              showsVerticalScrollIndicator={false}
              data={groupedTransactions}
              keyExtractor={(item) => item.date}
              renderItem={({item}) => {
                return (
                  <View style={styles.groupContainer}>
                    <View style={{flexDirection: 'row', alignContent: 'space-between', marginHorizontal: scale(14)}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.dateInText}>{item.dateInText}</Text>
                      </View>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Text style={styles.totalExpense}>{`${currency}${moneyFormat(item.totalExpense)}`}</Text>
                      </View>
                    </View>
                    <IndividualTransactions transactions={item.transactions} navigation={navigation} currency={currency} />
                  </View>
                )
              }}
            />
          </View>
      </View>
  )
}

const styles = StyleSheet.create({
    topContainer: {
      flex: Platform.OS === 'ios' ? 2 : 2.2
    },
    bottomContainer : {
      flex: Platform.OS === 'ios' ? 8 : 7.8
    },
    categoryContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: '100%',
        paddingBottom: verticalScale(18),
        gap: scale(4)
    },
    categoryContainerLeft: {
        flex: 0.25,
        alignItems: 'center'
    },
    categoryContainerRight: {
        flex: 0.75,
    },
    categoryName: {
        color: 'black',
        fontSize: verticalScale(20),
        fontWeight: '500',
        ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'})
    },
    categoryAmount: {
        color: 'black',
        fontSize: verticalScale(20),
        fontWeight: '400',
        ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'})
    },
    groupContainer: {
      marginTop: verticalScale(12),
      rowGap: verticalScale(12),
    },
    dateInText: {
      color: 'gray',
      fontSize: moderateScale(16)
    },
    totalExpense: {
      color: 'black',
      fontSize: moderateScale(17),
      fontWeight: '700'
    },
    transactionCount: {
      color: 'gray',
      fontWeight: '600', 
      fontSize: verticalScale(14), 
    },
    card: ({backgroundColor}) => ({
      backgroundColor: backgroundColor ? backgroundColor : 'whitesmoke', 
      paddingHorizontal: verticalScale(14),
      paddingVertical: verticalScale(14),
      borderRadius: moderateScale(8),
    }),
})