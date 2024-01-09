/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { View, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'
import { moneyFormat } from '../../utils/helper'
import { RealmContext } from '../../realm/RealmWrapper';
import { Budget, Category, Transaction } from '../../realm/Schema';
import Realm from 'realm';
import { useTheme } from '../../context';
import { useIsDarkMode } from '../../hooks/useIsDarkMode';
import { IconCard, Text } from '../../components';

export const CategoryScreen = ({navigation}) => {
  const contextTheme = useTheme()
  const isDarkMode = useIsDarkMode(contextTheme);
  const { useQuery } = RealmContext

  const selectedBudget = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0 && archived == $1', true, false);
  })[0]
  
  const categories = useQuery(Category, categories => {
    return categories.sorted('dateCreated', true)
  })
  
  const transactions = useQuery(Transaction, transaction => {
    return transaction.filtered('budgetId == $0', new Realm.BSON.ObjectId(selectedBudget?._id));
  }, [selectedBudget?.name])

  // const getAllTransactionOfSelectedBudget = (selectedBudget, transactions) => {
  //   if(selectedBudget) {
  //     return transactions?.filter(({budgetId}) => budgetId.toString() === selectedBudget.toString())
  //   }

  //   return []
  // }

  let grandTotalExpense = 0

  const processCategories = (allTransactionOfSelectedBudget, initialCategories) => {
    const categories = initialCategories?.map((category) => {
      let totalExpense =  0 
      let totalTransactionOfCategory = 0
      allTransactionOfSelectedBudget?.forEach(transaction => {
        if(transaction?.categoryId?.toString() === category?._id.toString()) {
          totalExpense += transaction.amount
          totalTransactionOfCategory += 1
        }
      });

      grandTotalExpense += totalExpense

      return {
        ...category,
        totalExpense: totalExpense,
        totalTransactionOfCategory
      }
    })

    return categories
  }

  const getPercentage = (categoriesData) => {
    return categoriesData.map(item => {
      const percentage = (item.totalExpense / grandTotalExpense) * 100;
  
      return {
        ...item,
        percentage: isNaN(percentage) ? '0.00%' : percentage.toFixed(2) + "%", // You can adjust the number of decimal places as needed
      };
    });
  
  }

  // const allTransactionOfSelectedBudget = getAllTransactionOfSelectedBudget(selectedBudget?._id, transactions)
  // let categoriesData = processCategories(allTransactionOfSelectedBudget, categories)
  let categoriesData = processCategories(transactions, categories)
  categoriesData.sort((a, b) => b.totalExpense - a.totalExpense);
  categoriesData = getPercentage(categoriesData)

  const currency = selectedBudget?.currency
  return (
    <View style={{flex: 1, backgroundColor: isDarkMode ? 'black' : 'white', paddingHorizontal: scale(16)}}>
      <CategoryList currency={currency} grandTotalExpense={grandTotalExpense} categories={categoriesData} navigation={navigation} isDarkMode={isDarkMode} />
    </View>
  )
}

const TotalExpenseHeader = ({currency, grandTotalExpense}) => {
  return (
    <View>
      <Text style={styles.totalExpense}>Total Expense</Text>
      <Text style={styles.grandTotalExpense}>{currency}{moneyFormat(grandTotalExpense)}</Text>
    </View>
  )
}

const CategoryList = ({currency, grandTotalExpense, categories, navigation, isDarkMode}) => {
  return (
    <FlatList
      ListHeaderComponent={<TotalExpenseHeader currency={currency} grandTotalExpense={grandTotalExpense} />}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      data={categories}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <ListItem currency={currency} item={item} navigation={navigation} isDarkMode={isDarkMode} />}
      // numColumns={1}
    />
  )
}

const ListItem = ({ currency, item, navigation, isDarkMode}) => {
  // navigation.navigate('UpdateCategoryScreen', { categoryId: item?._id.toString() }
  return (
    <TouchableOpacity style={[styles.item]} onPress={() => navigation.navigate('CategoryTransactionListScreen', { categoryId: item?._id.toString() })}>
      <View renderToHardwareTextureAndroid style={{flex: 1,  flexDirection: 'row'}}>
        <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', columnGap: moderateScale(12) }}>
          <IconCard icon={item.icon} iconColor={item.iconColor} backgroundColor={item.backgroundColor} />
          <View>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.boldText}>{item.name}</Text>
            <Text style={styles.transactionCount}>{`${item.totalTransactionOfCategory} transaction${item.totalTransactionOfCategory > 1 || item.totalTransactionOfCategory === 0 ? 's' : ''}`}</Text>
          </View>
        </View>
        <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'flex-end'}}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.boldText}>{`${currency ? currency : ''}${moneyFormat(item.totalExpense)}`}</Text>
          <Text style={[styles.percentage]}>{item.percentage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
} 

const styles = StyleSheet.create({
  totalExpense: {
    color: 'gray',
    fontSize: moderateScale(16),
    fontFamily: 'Muli-Bold',
  },
  grandTotalExpense: {
    color: 'black',
    fontSize: moderateScale(32),
    fontFamily: 'Muli-Bold',
  },
  item: {
    marginVertical: verticalScale(4),
    paddingVertical: verticalScale(4),
    // borderWidth: 1,
    borderColor: '#ccc',
  },
  percentage: {
    fontSize: moderateScale(12),
    fontWeight: '400',
    color: 'gray',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'})
  },
  boldText: {
    color: 'black', 
    fontWeight: '500', 
    fontSize: moderateScale(16),
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'})
  },
  transactionCount: {
    color: 'gray',
    fontWeight: '400', 
    fontSize: moderateScale(12),
    // fontFamily: 'Muli-SemiBold'
  }
});