import React, {useState, useRef, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import 'react-native-get-random-values';
import {moderateScale} from 'react-native-size-matters';
import {Typography, Input, CurrencyInput, DropDownPicker, CalendarDatePicker} from '../../components';
import { RealmContext } from '../../realm/RealmWrapper';
import { Category, Transaction, Budget } from '../../realm/Schema';
import Realm from 'realm';
import dayjs from 'dayjs';

export const CreateTransactionScreen = ({route, navigation}) => {

  const amountRef = useRef(null);

  const {budgetId, transactionId} = route.params;

  const { useRealm, useQuery, useObject } = RealmContext
  const realm = useRealm()
  
  const currentBudget = budgetId && useObject(Budget, new Realm.BSON.ObjectId(budgetId))

  const transactionToBeEdited = transactionId && useObject(Transaction, new Realm.BSON.ObjectId(transactionId));

  const categories = useQuery(Category, categories => {
    return categories.sorted('dateCreated', true)
  })

  const determineDate = () => {
    if(currentBudget.startDate > new Date()) {
      return new Date(currentBudget.startDate)
    }

    if(currentBudget.endDate < new Date()) {
      return new Date(currentBudget.endDate)
    }

    return new Date()
  }

  const [categoryList, setCategoryList] = useState(categories.map(({_id, name}) => ({label: name, value: _id.toString()})));
  
  const [amount, setAmount] = useState(transactionToBeEdited ? (transactionToBeEdited?.amount / 100).toString() : 0);
  const [category, setCategory] = useState(transactionToBeEdited ? transactionToBeEdited?.categoryId?.toString() : null);
  const [description, setDescription] = useState(transactionToBeEdited ? transactionToBeEdited?.description : '');
  const [transactionDate, setTransactionDate] = useState(transactionToBeEdited ? new Date(transactionToBeEdited?.transactionDate) : determineDate());

  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    const amountInCents = Math.round(Number(amount) * 100);

    try {
      realm.write(() => {
        if(transactionId) {
          transactionToBeEdited.amount = amountInCents
          transactionToBeEdited.categoryId = category ? new Realm.BSON.ObjectId(category) : null
          transactionToBeEdited.description = description
          transactionToBeEdited.transactionDate = dayjs(transactionDate).startOf('day').toString()
        } else {
          const newTransaction = {
            budgetId: new Realm.BSON.ObjectId(budgetId),
            categoryId: new Realm.BSON.ObjectId(category),
            amount: amountInCents,
            description,
            transactionDate: dayjs(transactionDate).startOf('day').toString(),
            dateCreated: new Date()
          };
          realm.create('Transaction', newTransaction)
        }
        navigation.goBack()
      });

    } catch (error) {
      console.log(error, 'Error create transaction')
    }
  };

  useEffect(() => {
    if(transactionId) {
      navigation.setOptions({ title: 'Update Transaction' })
    }
  }, [transactionId])

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Typography text="Amount" type="text-input" />
          <CurrencyInput
            ref={amountRef}
            value={amount}
            onChangeValue={setAmount}
            onLayout={() => !transactionId && amountRef.current.focus()} 
          />
        </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography text="Category" type="text-input" />
            <TouchableOpacity onPress={() => setCategory(null)}>
              <Text style={{fontSize: moderateScale(14), color: 'black'}}>Unselect</Text>
            </TouchableOpacity>
          </View>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={category}
            setValue={setCategory}
            items={categoryList}
            setItems={setCategoryList}
          />
        </View>
        <View>
          <Typography text="Description" type="text-input" />
          <Input value={description} setValue={setDescription} />
        </View>
        <View>
          <Typography text="Transaction Date" type="text-input" />
          <CalendarDatePicker 
            value={transactionDate} 
            setValue={setTransactionDate} 
            minDate={dayjs(currentBudget.startDate).format('YYYY-MM-DD').toString()} 
            maxDate={dayjs(currentBudget.endDate).format('YYYY-MM-DD').toString()} 
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: moderateScale(16),
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: 'black',
    padding: moderateScale(10),
    borderRadius: moderateScale(6),
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontFamily: 'Muli-Bold'
  },
});
