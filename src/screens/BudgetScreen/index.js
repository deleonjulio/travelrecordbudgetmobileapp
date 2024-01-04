import React, {memo} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import {colors} from '../../config';
import {getDaysLeft, moneyFormat} from '../../utils/helper';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {NoBudgetSelected} from './components';
import {RealmContext} from '../../realm/RealmWrapper';
import {Budget, Transaction, Category} from '../../realm/Schema';
import {IndividualTransactions} from './components/IndividualTransactions';
import {useTheme} from '../../context';
import {useIsDarkMode} from '../../hooks/useIsDarkMode';
import {Text} from '../../components';
import {FAB} from 'react-native-paper';

export const BudgetScreen = ({navigation}) => {
  const contextTheme = useTheme();
  const isDarkMode = useIsDarkMode(contextTheme);
  const {useQuery} = RealmContext;

  const categories = useQuery(Category);

  const selectedBudget = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0 && archived == $1', true, false);
  })[0];

  let transactions = useQuery(
    Transaction,
    transactions => {
      return transactions
        .filtered('budgetId == $0', selectedBudget?._id)
        .sorted('transactionDate', true)
        .sorted('dateCreated');
    },
    [selectedBudget?._id],
  );

  const totalExpense = transactions.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0);

  const totalTransactionCount = transactions.length;

  const retrieveCategoryInfo = categoryId => {
    let name = null;
    let icon = 'progress-question';
    let iconColor = 'black';
    let backgroundColor = 'whitesmoke';
    if (categoryId) {
      const categoryExist = categories?.find(
        ({_id}) => _id.toString() === categoryId.toString(),
      );
      if (categoryExist) {
        name = categoryExist?.name;
        icon = categoryExist?.icon;
        iconColor = categoryExist?.iconColor;
        backgroundColor = categoryExist?.backgroundColor;
      }
    }

    return {name, icon, iconColor, backgroundColor};
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = dayjs(transaction.transactionDate).format('YYYY-MM-DD');
    const dateInText = dayjs(transaction.transactionDate).format(
      'MMMM DD, YYYY',
    );
    const existingGroup = acc.find(group => group.date === date);
    const categoryInfo = retrieveCategoryInfo(transaction.categoryId);

    transaction.icon = categoryInfo.icon;
    transaction.categoryName = categoryInfo.name;
    transaction.iconColor = categoryInfo.iconColor;
    transaction.backgroundColor = categoryInfo.backgroundColor;
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

  // sort the groupTransactions by date
  groupedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // sort transactions inside groupTransaction
  groupedTransactions.forEach(item => {
    item.transactions.sort(
      (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated),
    );
  });

  if (selectedBudget?._id) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer({isDarkMode})}>
          <View style={{flex: 2, flexDirection: 'row'}}>
            <View
              style={{
                flex: 5,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: scale(24),
              }}>
              <BudgetName name={selectedBudget?.name} isDarkMode={isDarkMode} />
              <BudgetDaysLeft budget={selectedBudget} isDarkMode={isDarkMode} />
              <BudgetAmount
                budget={selectedBudget}
                totalExpense={totalExpense}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer({isDarkMode})}>
          {groupedTransactions.length ? (
            <RecentTransactionList
              currency={selectedBudget.currency}
              groupedTransactions={groupedTransactions}
              totalTransactionCount={totalTransactionCount}
              isDarkMode={isDarkMode}
            />
          ) : (
            <RecentTransactionEmpty
              selectedBudgetId={selectedBudget?._id}
              addTransaction={() =>
                navigation.navigate('CreateTransactionScreen', {
                  budgetId: selectedBudget?._id.toString(),
                })
              }
            />
          )}
          {groupedTransactions.length > 0 && (
            <FAB
              icon="plus"
              style={styles.fab}
              onPress={() =>
                navigation.navigate('CreateTransactionScreen', {
                  budgetId: selectedBudget?._id.toString(),
                })
              }
            />
          )}
        </View>
      </View>
    );
  }

  return <NoBudgetSelected />;
};

const BudgetName = memo(function BudgetName({name, isDarkMode}) {
  if (!name) {
    return <Text style={styles.budgetName({isDarkMode})}>No budget set</Text>;
  }

  return (
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      style={styles.budgetName({isDarkMode})}>
      {name}
    </Text>
  );
});

const BudgetDaysLeft = memo(function BudgetDaysLeft({budget, isDarkMode}) {
  const currentDate = new Date();
  let daysLeft = 0;
  let daysLeftMessage = '';
  if (budget) {
    if (currentDate < new Date(budget.startDate)) {
      daysLeftMessage = `Budget starts on ${
        new Date(budget.startDate).toISOString().split('T')[0]
      }`;
    } else if (currentDate > new Date(budget.endDate)) {
      daysLeftMessage = `Budget has ended on ${
        new Date(budget.endDate).toISOString().split('T')[0]
      }`;
    } else {
      daysLeft = getDaysLeft(currentDate, budget?.endDate) - 1;

      if (daysLeft > 1) {
        daysLeftMessage = `Budget for the next ${daysLeft} days`;
      } else if (daysLeft === 1) {
        daysLeftMessage = 'Remaining budget for the next day.';
      } else {
        daysLeftMessage = 'Remaining budget for today.';
      }
    }
  }

  if (budget?.startDate) {
    return (
      <Text
        style={{
          fontWeight: '300',
          fontSize: moderateScale(15),
          color: isDarkMode ? 'white' : 'black',
        }}>
        {daysLeftMessage}
      </Text>
    );
  }

  return null;
});

const BudgetAmount = memo(function BudgetAmount({
  budget,
  totalExpense,
  isDarkMode,
}) {
  let totalRemaining = 0;
  if (budget?.amount) {
    totalRemaining = budget?.amount;
  }

  if (totalExpense) {
    totalRemaining -= totalExpense;
  }

  return (
    <View style={styles.budgetAmount}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          fontSize: moderateScale(32),
          color: isDarkMode ? 'white' : 'black',
          fontFamily: 'Muli-Bold',
        }}>
        {`${budget.currency ? budget.currency : ''}${moneyFormat(
          totalRemaining,
        )}`}
      </Text>
    </View>
  );
});

const RecentTransactionEmpty = ({selectedBudgetId, addTransaction}) => {
  return (
    <View style={styles.bottomContainerEmpty}>
      <Icon name="card-plus-outline" size={38} color={'black'} />
      <Text style={{fontSize: 22, color: 'black', marginTop: 8}}>
        No transactions
      </Text>
      <Text style={{color: 'black', marginBottom: 16}}>
        Get started by adding a new transaction.
      </Text>
      <TouchableOpacity
        disabled={!selectedBudgetId}
        style={styles.button}
        onPress={addTransaction}>
        <Text style={styles.buttonText}>New Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const RecentTransactionList = memo(function RecentTransactionList({
  currency,
  groupedTransactions,
  totalTransactionCount,
  isDarkMode,
}) {
  const navigation = useNavigation();
  return (
    <FlatList
      key={groupedTransactions}
      overScrollMode="never"
      ListHeaderComponent={() => (
        <TransctionListHeader
          totalTransactionCount={totalTransactionCount}
          navigation={navigation}
          isDarkMode={isDarkMode}
        />
      )}
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
                <Text style={styles.dateInText({isDarkMode})}>
                  {item.dateInText}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.totalExpense({isDarkMode})}>{`${
                  currency ? currency : ''
                }${moneyFormat(item.totalExpense)}`}</Text>
              </View>
            </View>
            <IndividualTransactions
              transactions={item.transactions}
              navigation={navigation}
              currency={currency}
              isDarkMode={isDarkMode}
            />
          </View>
        );
      }}
    />
  );
});

const TransctionListHeader = memo(function ({
  totalTransactionCount,
  navigation,
  isDarkMode,
}) {
  return (
    <View style={styles.transactionListHeaderContainer}>
      <View>
        <Text style={styles.transactionListHeaderText({isDarkMode})}>
          Transactions History
        </Text>
        <Text style={styles.transactionCount({isDarkMode})}>
          {totalTransactionCount} transactions
        </Text>
      </View>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigation.navigate('BudgetSearchTransactionScreen')}>
        <Icon
          name="magnify"
          color={isDarkMode ? 'white' : 'black'}
          size={moderateScale(28)}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  topContainer: ({isDarkMode = false}) => ({
    flex: verticalScale(3),
    backgroundColor: isDarkMode ? 'black' : 'white',
  }),
  bottomContainerEmpty: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: ({isDarkMode = false}) => ({
    flex: verticalScale(8),
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#0d0d0d' : null,
  }),
  budgetName: ({isDarkMode = false}) => ({
    letterSpacing: scale(0.5),
    fontSize: moderateScale(24),
    color: isDarkMode ? 'white' : 'black',
    textAlign: 'center',
    marginBottom: verticalScale(2),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  }),
  button: {
    backgroundColor: 'black',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    margin: moderateScale(2),
    borderRadius: moderateScale(4),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  budgetAmount: {
    flexDirection: 'row',
  },
  groupContainer: {
    marginTop: verticalScale(12),
    rowGap: verticalScale(12),
  },
  dateInText: ({isDarkMode = false}) => ({
    color: isDarkMode ? '#7f7f7f' : 'gray',
    fontSize: moderateScale(16),
    fontWeight: '400',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'}),
  }),
  totalExpense: ({isDarkMode = false}) => ({
    color: isDarkMode ? 'white' : 'black',
    fontSize: moderateScale(17),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  }),
  transactionListHeaderContainer: {
    paddingHorizontal: scale(14),
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionListHeaderText: ({isDarkMode = false}) => ({
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: isDarkMode ? 'white' : 'black',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'}),
  }),
  transactionCount: ({isDarkMode = false}) => ({
    fontSize: moderateScale(14),
    color: isDarkMode ? 'white' : 'black',
  }),
  fab: {
    position: 'absolute',
    margin: moderateScale(16),
    backgroundColor: 'white',
    right: 0,
    bottom: 0,
  },
});
