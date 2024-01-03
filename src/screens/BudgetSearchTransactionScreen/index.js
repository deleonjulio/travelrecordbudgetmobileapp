import React, {useState, useRef, memo} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  moneyFormat,
} from '../../utils/helper';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import { RealmContext } from '../../realm/RealmWrapper';
import { Budget, Transaction, Category } from '../../realm/Schema';
import { IndividualTransactions } from '../BudgetScreen/components/IndividualTransactions';
import { Input, Text } from '../../components';

export const BudgetSearchTransactionScreen = ({navigation}) => {
  const searchRef = useRef(null);
  const [search, setSearch] = useState('');

  const { useQuery } = RealmContext

  const categories = useQuery(Category)
  
  const selectedBudget = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0 && archived == $1', true, false);
  })[0];

  let transactions = useQuery(Transaction, transactions => {
    // .filtered('description CONTAINS[c] $0', search)
    return transactions.filtered('budgetId == $0', selectedBudget?._id).sorted('transactionDate', true)
  }, [selectedBudget?._id])

  const totalTransactionCount = transactions?.length

  const retrieveCategoryInfo = (categoryId) => {
    let name = null
    let icon = 'progress-question'
    let iconColor = 'black'
    let backgroundColor = 'whitesmoke'
    if(categoryId) {
      const categoryExist = categories?.find(({_id}) => _id.toString() === categoryId.toString())
      if(categoryExist) {
        name = categoryExist?.name
        icon = categoryExist?.icon
        iconColor = categoryExist?.iconColor
        backgroundColor = categoryExist?.backgroundColor
      }
    }

    return {name, icon, iconColor, backgroundColor}
  }

  transactions = transactions.map((transaction) => {
    const categoryInfo = retrieveCategoryInfo(transaction.categoryId)
    transaction.icon = categoryInfo.icon
    transaction.categoryName = categoryInfo.name
    transaction.iconColor = categoryInfo.iconColor
    transaction.backgroundColor = categoryInfo.backgroundColor
    return {
        ...transaction
    }
  })

  // here is where search happen
  transactions = transactions.filter((transaction) => {
    if(transaction.categoryName?.toLowerCase().includes(search.toLocaleLowerCase()) || transaction.description.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || moneyFormat(transaction.amount).includes(search)) {
      return {...transaction}
    }
  })

  const groupedTransactions = transactions?.reduce((acc, transaction) => {
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

  // sort the groupTransactions by date
  groupedTransactions.length && groupedTransactions?.sort((a, b) => new Date(b.date) - new Date(a.date));

  // sort transactions inside groupTransaction
  groupedTransactions && groupedTransactions.forEach(item => {
    item.transactions?.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
  });

  if(selectedBudget?._id) {
    return (
      <View style={styles.container}>
        <View style={{paddingHorizontal: scale(12), paddingTop: verticalScale(14), backgroundColor: 'white'}}> 
          <Input autoCapitalize="none" ref={searchRef} setValue={setSearch} value={search} placeholder="Search category, amount or description" onLayout={() => searchRef.current.focus()} />
        </View>
        <View style={styles.bottomContainer}>
          <RecentTransactionList currency={selectedBudget.currency} groupedTransactions={groupedTransactions} totalTransactionCount={totalTransactionCount} />
        </View>
      </View>
    );
  }

  return null

};

const RecentTransactionList = memo(function RecentTransactionList({currency, groupedTransactions, totalTransactionCount}) {
  const navigation = useNavigation();
  return (
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
                <Text style={styles.totalExpense}>{`${currency ? currency: ''}${moneyFormat(item.totalExpense)}`}</Text>
              </View>
            </View>
            <IndividualTransactions transactions={item.transactions} navigation={navigation} currency={currency} />
          </View>
        )
      }}
    />
  )
});

export const NoTransactionFound = () => (
  <View style={{flex: 1, alignItems: 'center', marginTop: verticalScale(48)}}>
    <Text style={styles.noTransactionFoundText}>No Transaction Found</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionDate: {
    fontSize: verticalScale(15),
    fontWeight: '400',
  },
  groupContainer: {
    marginTop: verticalScale(12),
    rowGap: verticalScale(12),
  },
  dateInText: {
    color: 'gray',
    fontSize: moderateScale(16),
    fontWeight: '500',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'}),
  },
  totalExpense: {
    color: 'black',
    fontSize: moderateScale(17),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  },
  noTransactionFoundText: {
    color: 'black',
    fontSize: moderateScale(20),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  }
});
