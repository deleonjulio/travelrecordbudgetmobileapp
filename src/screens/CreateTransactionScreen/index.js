import React, {useState, useRef} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import 'react-native-get-random-values';
import {moderateScale} from 'react-native-size-matters';
import {Typography, Input, CurrencyInput, DropDownPicker, CalendarDatePicker} from '../../components';
import { RealmContext } from '../../realm/RealmWrapper';
import { Category } from '../../realm/Schema';
import Realm from 'realm';
import dayjs from 'dayjs';

export const CreateTransactionScreen = ({route, navigation}) => {
  const {budgetId} = route.params;

  const { useRealm, useQuery} = RealmContext
  const realm = useRealm()

  const categories = useQuery(Category, categories => {
    return categories.sorted('dateCreated', true)
  })
  
  const amountRef = useRef(null);

  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState(categories.map(({_id, name}) => ({label: name, value: _id})));

  const onSubmit = async () => {
    const amountInCents = Math.round(Number(amount) * 100);
    const newTransaction = {
      budgetId: new Realm.BSON.ObjectId(budgetId),
      categoryId: category,
      amount: amountInCents,
      description,
      transactionDate: dayjs(transactionDate).startOf('day').toString(),
      dateCreated: new Date()
    };

    try {
      realm.write(() => {
        realm.create('Transaction', newTransaction)
        navigation.goBack()
      });

    } catch (error) {
      console.log(error, 'Error create transaction')
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Typography text="Amount" type="text-input" />
          <CurrencyInput
            ref={amountRef}
            value={amount}
            onChangeValue={setAmount}
            onLayout={() => amountRef.current.focus()} 
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
          <CalendarDatePicker value={transactionDate} setValue={setTransactionDate} />
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
