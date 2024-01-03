import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import {colors} from '../../config';
import {
  retrieveData,
  getDaysLeft,
  moneyFormat,
  storeData,
} from '../../utils/helper';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

export const BudgetScreen = ({navigation}) => {
  const [budgetCount, setBudgetCount] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [transactions, setTransactions] = useState({
    totalExpense: 0,
    list: []
  });

  const [categories, setCategories] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const getBudgets = async () => {
        try {
          const budgetsFromStorage = await retrieveData('budgets');
          if (budgetsFromStorage) {
            const {
              selectedBudget: initialSelectedBudget,
              budgets: initialBudgets,
            } = budgetsFromStorage;
            setBudgetCount(initialBudgets?.length);
            setSelectedBudget(
              initialBudgets.find(({id}) => id === initialSelectedBudget),
            );
          }
        } catch (error) {
          Alert.alert('Something went wrong on getBudgets!');
        }
      };

      const getCategories = async () => {
        try {
          const categoriesFromStorage = await retrieveData('categories');
          setCategories(categoriesFromStorage);
        } catch (error) {
          Alert.alert('Something went wrong on getCategories!');
        }
      };

      getBudgets();
      getCategories();
    }, []),
  );

  const handleSwitchBudget = async direction => {
    try {
      const budgetsFromStorage = await retrieveData('budgets');
      const {budgets} = budgetsFromStorage;
      let selectedIndex = budgets.findIndex(({id}) => id === selectedBudget.id);

      if (direction === 'previous') {
        selectedIndex = (selectedIndex - 1 + budgets.length) % budgets.length;
      } else {
        selectedIndex = (selectedIndex + 1) % budgets.length;
      }

      setSelectedBudget(budgets[selectedIndex]);

      await storeData('budgets', {
        ...budgetsFromStorage,
        selectedBudget: budgets[selectedIndex]?.id,
      });
    } catch (error) {
      Alert.alert('Something went wrong on handleSwitchBudget!');
    }
  };

  const retrieveCategoryName = (categoryId) => {
    const categoryName = categories?.find(({id}) => id === categoryId)?.name
    
    if(categoryName) {
      return categoryName;
    } else {
      return '---'
    }
  }

  useEffect(() => {
    const getTransactions = async() => {
      try {
        const initialTransactions = await retrieveData('transactions');
        if(initialTransactions) {
          const filteredTransactions = initialTransactions.filter((transaction) => transaction.budgetId === selectedBudget.id);
          const totalExpense = filteredTransactions.reduce((accumulator, data) => accumulator + data.amount, 0)
  
          setTransactions({
            totalExpense: totalExpense,
            list: filteredTransactions,
          })
        }
      } catch (error) {
        Alert.alert('Something went wrong on getTransactions!');
      }
    };
    
    if (selectedBudget) {
      getTransactions();
    } else {
      setTransactions({
        totalExpense: 0,
        list: [],
      })
    }
  }, [selectedBudget])

  return (
    <React.Fragment>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={{flex: 2, flexDirection: 'row'}}>
            {budgetCount > 1 && (
              <TouchableOpacity
                style={styles.previousBudget}
                onPress={() => handleSwitchBudget('previous')}>
                <Icon
                  name="chevron-left-circle"
                  color={colors.color5}
                  size={moderateScale(50)}
                />
              </TouchableOpacity>
            )}
            <View
              style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
              <BudgetName name={selectedBudget?.name} />
              <BudgetDaysLeft budget={selectedBudget} />
              <BudgetAmount budget={selectedBudget} totalExpense={transactions.totalExpense} />
            </View>
            {budgetCount > 1 && (
              <TouchableOpacity
                style={styles.nextBudget}
                onPress={() => handleSwitchBudget('next')}>
                <Icon
                  name="chevron-right-circle"
                  color={colors.color5}
                  size={moderateScale(50)}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <BudgetButton budget={selectedBudget} />
          </View>
        </View>
        {transactions.list.length ? (
          <RecentTransactionList transactionList={transactions.list} retrieveCategoryName={retrieveCategoryName} />
        ) 
        : (
          <RecentTransactionEmpty selectedBudgetId={selectedBudget?.id} addTransaction={() => navigation.navigate('CreateTransactionScreen', {budgetId: selectedBudget.id})} />
        )}
        
      </View>
    </React.Fragment>
  );
};

const BudgetName = memo(function BudgetName({name}) {
  return (
    <Text style={styles.budgetName}>
      {name?.length > 25 ? name?.slice(0, 25) + '...' : name}
    </Text>
  );
});

const BudgetDaysLeft = memo(function BudgetDaysLeft({budget}) {
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
        daysLeftMessage = `Remaining budget for the next ${daysLeft} days`;
      } else if (daysLeft === 1) {
        daysLeftMessage = 'Remaining budget for the next day.';
      } else {
        daysLeftMessage = 'Remaining budget for today.';
      }
    }
  }
  return (
    <Text style={{fontWeight: '300', fontSize: 14, color: '#D6EBEE'}}>
      {budget?.startDate ? daysLeftMessage : 'No budget set'}
    </Text>
  );
});

const BudgetAmount = memo(function BudgetAmount({budget, totalExpense}) {
  let totalRemaining = 0
  if(budget?.amount) {
    totalRemaining = budget?.amount;
  }

  if(totalExpense) {
    totalRemaining -= totalExpense
  }

  return (
    <View style={styles.budgetAmount}>
      {/* <Text style={{fontSize: 35, color: '#D6EBEE'}}>₱</Text> */}
      <Text style={{fontSize: 35, color: '#D6EBEE'}}>
        {moneyFormat(totalRemaining)}
      </Text>
    </View>
  );
});

const BudgetButton = memo(function BudgetButton({budget}) {
  const navigation = useNavigation();
  return (
    <View style={styles.budgetButtonContainer}>
      <TouchableOpacity
        style={styles.budgetButton}
        onPress={() => navigation.navigate('CreateBudgetScreen')}>
        <Icon name="cash-plus" size={moderateScale(28)} color={colors.color1} />
        <Text style={styles.budgetButtonText}>New</Text>
        <Text style={styles.budgetButtonText}>Budget</Text>
      </TouchableOpacity>
      {budget && (
        <TouchableOpacity
          style={styles.budgetButton}
          onPress={() =>
            navigation.navigate('UpdateBudgetScreen', {
              budgetId: budget.id,
            })
          }>
          <Icon name="square-edit-outline" size={moderateScale(28)} color={colors.color1} />
          <Text style={styles.budgetButtonText}>Edit</Text>
          <Text style={styles.budgetButtonText}>Budget</Text>
        </TouchableOpacity>
      )}
      {budget && (
        <TouchableOpacity
          style={styles.budgetButton}
          onPress={() => navigation.navigate('CreateTransactionScreen', {budgetId: budget.id})
          }>
          <Icon name="cash-register" size={moderateScale(28)} color={colors.color1} />
          <Text style={styles.budgetButtonTextTransaction}>New</Text>
          <Text style={styles.budgetButtonTextTransaction}>Transaction</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const RecentTransactionEmpty = ({selectedBudgetId, addTransaction}) => {
  return (
    <View style={styles.bottomContainerEmpty}>
      <Icon name="card-plus-outline" size={38} color={colors.color1} />
      <Text style={{fontSize: 22, color: colors.color1, marginTop: 8}}>
        No transactions
      </Text>
      <Text style={{color: colors.color1, marginBottom: 16}}>
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

const RecentTransactionList = memo(function RecentTransactionList({transactionList, retrieveCategoryName}) {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomContainer}>
      <Text style={styles.bottomContainerTitle}>Transactions</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={transactionList}
        renderItem={({item}) => {
          return (
            <TouchableOpacity key={item?.id} style={styles.budgetCard} onPress={() => navigation.navigate('UpdateTransactionScreen', {transactionId: item?.id})}>
              <View style={styles.budgetCardTextContainer}>
                <View style={styles.budgetCardLeft}>
                  <Text style={styles.transactionDescription}>{item?.description || '---'}</Text>
                  <Text style={styles.transactionCategory}>{retrieveCategoryName(item?.categoryId)}</Text>
                </View>
                <View style={styles.budgetCardRight}>
                  <Text style={styles.transactionAmount}>
                    {`${moneyFormat(item?.amount)}`}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {`${dayjs(item.transactionDate).format('YYYY-MM-DD')}`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: colors.color2,
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
  },
  topContainer: {
    flex: 4,
    backgroundColor: colors.color2,
  },
  bottomContainerEmpty: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.color5,
  },
  bottomContainer: {
    flex: 8,
    paddingHorizontal: scale(25),
    justifyContent: 'center',
    backgroundColor: colors.color5,
  },
  budgetButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: moderateScale(12),
  },
  budgetButton: {
    borderWidth: 1,
    borderColor: colors.color5,
    backgroundColor: colors.color5,
    padding: moderateScale(8),
    paddingHorizontal: scale(14),
    minWidth: scale(100),
    maxWidth: scale(100),
    borderRadius: moderateScale(12),
  },
  budgetButtonText: {
    letterSpacing: scale(0.5),
    fontSize: moderateScale(11),
    color: colors.color2,
    fontWeight: '500',
  },
  budgetButtonTextTransaction: {
    letterSpacing: scale(0.5),
    fontSize: moderateScale(11),
    color: colors.color2,
    fontWeight: '500',
  },
  previousBudget: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  nextBudget: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  budgetName: {
    letterSpacing: scale(0.5),
    fontSize: verticalScale(14),
    color: colors.color5,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: verticalScale(2),
  },
  button: {
    backgroundColor: colors.color2,
    padding: moderateScale(10),
    margin: moderateScale(2),
    borderRadius: moderateScale(4),
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
  },
  budgetAmount: {
    flexDirection: 'row'
  },
  budgetCard: {
    backgroundColor: 'white',
    // marginHorizontal: scale(25),
    marginVertical: verticalScale(10),
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    elevation: 2,
  },
  transactionDescription: {
    color: colors.color2,
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  transactionCategory: {
    color: colors.color2,
    fontSize: moderateScale(14),
    fontWeight: '400',
  },
  transactionAmount: {
    color: colors.color3,
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  transactionDate: {
    color: colors.color2,
    fontSize: verticalScale(14),
    fontWeight: '400',
  },
  budgetCardTextContainer: {
    paddingHorizontal: scale(4),
    flexDirection: 'row'
  },
  budgetCardLeft: {
    flex: 1,
    alignItems: 'flex-start'
  },
  budgetCardRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  bottomContainerTitle: {
    color: colors.color2,
    fontSize: moderateScale(18),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(6),
  }
});
