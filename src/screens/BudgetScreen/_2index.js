import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import {colors} from '../../config';
import {
  getDaysLeft,
  moneyFormat,
} from '../../utils/helper';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import { NoBudgetSelected } from './components';
import { RealmContext } from '../../realm/RealmWrapper';
import { Budget, Transaction, Category } from '../../realm/Schema';

export const BudgetScreen = ({navigation}) => {
  const { useQuery } = RealmContext

  const allBudget = useQuery(Budget, budgets => {
    return budgets.filtered('archived == $0', false);
  })
  const categories = useQuery(Category)
  
  const selectedBudget = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0 && archived == $1', true, false);
  })[0];

  const transactions = useQuery(Transaction, transactions => {
    return transactions.filtered('budgetId == $0', selectedBudget?._id).sorted('dateCreated', true);;
  }, [selectedBudget?._id])
  
  const totalExpense = transactions.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0)

  // const handleSwitchBudget = async direction => {
  //   try {
  //     const budgetsFromStorage = await retrieveData('budgets');
  //     const {budgets} = budgetsFromStorage;
  //     let selectedIndex = budgets.findIndex(({id}) => id === selectedBudget.id);

  //     if (direction === 'previous') {
  //       selectedIndex = (selectedIndex - 1 + budgets.length) % budgets.length;
  //     } else {
  //       selectedIndex = (selectedIndex + 1) % budgets.length;
  //     }

  //     await getTransactions(budgets[selectedIndex]?.id)

  //     setSelectedBudget(budgets[selectedIndex]);

  //     await storeData('budgets', {
  //       ...budgetsFromStorage,
  //       selectedBudget: budgets[selectedIndex]?.id,
  //     });

  //     setSelectedVisibleBudget(budgets[selectedIndex]?.id)
  //   } catch (error) {
  //     Alert.alert('Something went wrong on handleSwitchBudget!');
  //   }
  // };

  const retrieveCategoryName = (categoryId) => {
    let categoryName = '---'
    if(categoryId) {
      const categoryExist = categories?.find(({_id}) => _id.toString() === categoryId.toString())?.name
      if(categoryExist) {
        categoryName = categoryExist
      }
    }
    return categoryName
  }

  const retrieveCategoryIcon = (categoryId) => {
    let categoryIcon = 'progress-question'
    if(categoryId) {
      const categoryExist = categories?.find(({_id}) => _id.toString() === categoryId.toString())?.icon
      if(categoryExist) {
        categoryIcon = categoryExist
      }
    }
    return categoryIcon
  }

  if(selectedBudget?._id) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={{flex: 2, flexDirection: 'row'}}>
            {allBudget.length > 1 && (
              <TouchableOpacity
                style={styles.previousBudget}
                onPress={() => null}>
                <Icon
                  name="chevron-left-circle"
                  color={'black'}
                  size={moderateScale(46)}
                />
              </TouchableOpacity>
            )}
            <View
              style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
              <BudgetName name={selectedBudget?.name} />
              <BudgetDaysLeft budget={selectedBudget} />
              <BudgetAmount budget={selectedBudget} totalExpense={totalExpense} />
            </View>
            {allBudget.lentgth > 1 && (
              <TouchableOpacity
                style={styles.nextBudget}
                onPress={() => null}>
                <Icon
                  name="chevron-right-circle"
                  color={'black'}
                  size={moderateScale(46)}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {transactions.length ? (
          <RecentTransactionList currency={selectedBudget.currency} transactionList={transactions} retrieveCategoryName={retrieveCategoryName} retrieveCategoryIcon={retrieveCategoryIcon} />
        ) 
        : (
          <RecentTransactionEmpty selectedBudgetId={selectedBudget?._id} addTransaction={() => navigation.navigate('CreateTransactionScreen', {budgetId: selectedBudget?._id.toString()})} />
        )}
        {transactions.length > 0 && (
          <TouchableOpacity 
            style={{position: 'absolute', bottom: verticalScale(12), right: scale(24), borderColor: 'black', backgroundColor: 'white', elevation: 5, borderWidth: 1, borderColor: 'gray', padding: 14, borderRadius: 999}}
            onPress={() => navigation.navigate('CreateTransactionScreen', {budgetId: selectedBudget?._id.toString()})}
          >
            <Icon
              name="plus"
              color={'black'}
              size={moderateScale(24)}
            />
          </TouchableOpacity>
          )
        }
      </View>
    );
  }

  return <NoBudgetSelected />

};

const BudgetName = memo(function BudgetName({name}) {
  if(!name) {
    return (
      <Text style={styles.budgetName}>
        No budget set
      </Text>
    )
  }

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
        daysLeftMessage = `Budget for the next ${daysLeft} days`;
      } else if (daysLeft === 1) {
        daysLeftMessage = 'Remaining budget for the next day.';
      } else {
        daysLeftMessage = 'Remaining budget for today.';
      }
    }
  }

  if(budget?.startDate) {
    return (
      <Text style={{fontWeight: '300', fontSize: moderateScale(15), color: 'black'}}>
        {daysLeftMessage}
      </Text>
    )
  }

  return null
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
      <Text style={{fontSize: moderateScale(35), color: 'black', fontWeight: '300'}}>
        {`${budget.currency ? budget.currency : ''}${moneyFormat(totalRemaining)}`}
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

const RecentTransactionList = memo(function RecentTransactionList({currency, transactionList, retrieveCategoryName, retrieveCategoryIcon}) {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomContainer}>
      <FlatList
        bounces={false}
        ListHeaderComponent={() => (
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.bottomContainerTitle}>Recent Transactions</Text>
            {transactionList?.length > 5 && <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
            }
          </View>
        )}
        showsVerticalScrollIndicator={false}
        data={transactionList.slice(0, 5)}
        renderItem={({item}) => {
          return (
            <TouchableOpacity key={item?.id} style={styles.budgetCard} onPress={() => navigation.navigate('UpdateTransactionScreen', {transactionId: item?._id.toString()})}>
              <View style={styles.budgetCardTextContainer}>
                <View style={styles.budgetCardLeft}>
                  <Icon name={retrieveCategoryIcon(item?.categoryId)} size={moderateScale(26)} color="black" />
                </View>
                <View style={styles.budgetCardCenter}>
                  <Text style={styles.transactionCategory}>{retrieveCategoryName(item?.categoryId)}</Text>
                  <Text style={styles.transactionDescription}>{item?.description || '---'}</Text>
                  <Text style={styles.transactionDate}>
                    {`${dayjs(item.transactionDate).format('MMM DD, YYYY')}`}
                  </Text>
                </View>
                <View style={styles.budgetCardRight}>
                  <Text style={styles.transactionAmount}>
                    {`${currency ? currency : ''}${moneyFormat(item?.amount)}`}
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
    flex: 3,
    backgroundColor: 'white'
  },
  bottomContainerEmpty: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 8,
    paddingHorizontal: scale(25),
    justifyContent: 'center',
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
    elevation: 2,
    borderColor: 'ghostwhite',
    backgroundColor: 'ghostwhite',
    padding: moderateScale(12),
    // paddingHorizontal: scale(14),
    // minWidth: scale(100),
    // maxWidth: scale(100),
    borderRadius: moderateScale(8),
  },
  budgetButtonText: {
    letterSpacing: scale(0.5),
    fontSize: moderateScale(11),
    color: 'black',
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
    fontSize: verticalScale(24),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(2),
  },
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
    fontSize: moderateScale(15),
    fontWeight: '400',
  },
  transactionCategory: {
    color: 'black',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  transactionAmount: {
    color: 'black',
    fontSize: moderateScale(18),
    fontWeight: '300',
  },
  transactionDate: {
    fontSize: verticalScale(15),
    fontWeight: '400',
  },
  budgetCardTextContainer: {
    paddingHorizontal: scale(4),
    flexDirection: 'row'
  },
  budgetCardLeft: {
    flex: 0.30,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  budgetCardCenter: {
    flex: 1,
    alignItems: 'flex-start'
  },
  budgetCardRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  bottomContainerTitle: {
    color: 'black',
    fontSize: moderateScale(17),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(6),
  },
  viewAll: {
    color: 'orange',
    fontSize: moderateScale(17),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(6),
  }
});
