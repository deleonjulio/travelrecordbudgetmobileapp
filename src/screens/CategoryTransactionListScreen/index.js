import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RealmContext} from '../../realm/RealmWrapper';
import {moneyFormat, determineTextColor} from '../../utils/helper';
import {Category, Budget, Transaction} from '../../realm/Schema';
import Realm from 'realm';
import {verticalScale, moderateScale, scale} from 'react-native-size-matters';
import dayjs from 'dayjs';
import {IndividualTransactions} from './components/IndividualTransactions';
import {Text, IconCard} from '../../components';
import {NoTransactionFound} from '..';
import { useLayoutEffect } from 'react';

export const CategoryTransactionListScreen = ({navigation, route}) => {
  const {useObject, useQuery} = RealmContext;
  const {categoryId} = route?.params;
  const {
    name: categoryName,
    icon: categoryIcon,
    iconColor,
    backgroundColor,
  } = useObject(Category, new Realm.BSON.ObjectId(categoryId));

  const textColor = determineTextColor(iconColor)

  const selectedBudget = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0 && archived == $1', true, false);
  })[0];

  const transactions = useQuery(Transaction, transaction => {
    return transaction
      .filtered(
        'budgetId == $0 && categoryId == $1',
        new Realm.BSON.ObjectId(selectedBudget?._id),
        new Realm.BSON.ObjectID(categoryId),
      )
      .sorted('dateCreated', true);
  });

  const totalExpense = transactions.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0);

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = dayjs(transaction.transactionDate).format('YYYY-MM-DD');
    const dateInText = dayjs(transaction.transactionDate).format(
      'MMMM DD, YYYY',
    );
    const existingGroup = acc.find(group => group.date === date);

    if (existingGroup) {
      existingGroup.totalExpense += transaction.amount;
      existingGroup.transactions.push(transaction);
    } else {
      acc.push({
        date: date,
        dateInText,
        totalExpense: transaction.amount,
        transactions: [transaction],
      });
    }

    return acc;
  }, []);

  groupedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const currency = selectedBudget?.currency ? selectedBudget.currency : '';

  useLayoutEffect(() => {

    navigation.setOptions({ 
      headerShadowVisible: false,
      headerStyle: { 
        backgroundColor: iconColor,
      },
      headerTintColor: textColor
  })
  }, [iconColor])

  const Header = () => {
    if(transactions.length > 0) {
      return (
        <View style={{backgroundColor: 'white'}}>
          <View style={{marginHorizontal: scale(14), marginVertical: verticalScale(10), alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={styles.transactionCount}>{`${
              transactions.length
            } transaction${
              transactions.length > 1 || transactions.length === 0 ? 's' : ''
            }`}</Text>
            <Text style={styles.categoryAmount}>{`${currency}${moneyFormat(
              totalExpense,
            )}`}</Text>
          </View>
      </View>
      )
    }
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.topContainer}>
        <View style={styles.categoryContainer({iconColor})}>
          <View>
            <View style={styles.card}>
              <Icon
                name={categoryIcon ? categoryIcon : 'progress-question'}
                size={moderateScale(30)}
                color={iconColor}
              />
            </View>
          </View>
          <Text style={styles.categoryName({textColor})}>{categoryName}</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <FlatList
          ListHeaderComponent={<Header />}
          ListEmptyComponent={<NoTransactionFound />}
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={groupedTransactions}
          keyExtractor={item => item.date}
          renderItem={({item}) => {
            return (
              <View style={styles.groupContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'space-between',
                    marginHorizontal: scale(14),
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={styles.dateInText}>{item.dateInText}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text
                      style={styles.totalExpense}>{`${currency}${moneyFormat(
                      item.totalExpense,
                    )}`}</Text>
                  </View>
                </View>
                <IndividualTransactions
                  transactions={item.transactions}
                  navigation={navigation}
                  currency={currency}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: Platform.OS === 'ios' ? 2 : 1.8,
  },
  bottomContainer: {
    flex: Platform.OS === 'ios' ? 8 : 8.2,
  },
  categoryContainer: ({iconColor}) => ({
    display: 'flex',
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: iconColor,
    height: '100%',
    gap: scale(4),
  }),
  categoryName:({textColor}) => ({
    color: textColor,
    fontSize: moderateScale(20),
    fontWeight: '500',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  }),
  categoryAmount: {
    color: 'black',
    fontSize: moderateScale(20),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  },
  groupContainer: {
    marginTop: verticalScale(12),
    rowGap: verticalScale(12),
  },
  dateInText: {
    color: 'gray',
    fontSize: moderateScale(16),
    fontWeight: '400',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'}),
  },
  totalExpense: {
    color: 'black',
    fontSize: moderateScale(17),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  },
  transactionCount: {
    color: 'black',
    fontSize: verticalScale(14),
    ...(Platform.OS === 'android' && {fontFamily: 'Muli'}),
  },
  card: {
    backgroundColor: 'white',
    // padding: moderateScale(14), 
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(18),
    borderRadius: moderateScale(999),
    borderWidth: moderateScale(0.5),
    borderColor: 'lightgray',
  },
});
