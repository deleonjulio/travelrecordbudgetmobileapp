import React, {useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import 'react-native-get-random-values';
import {verticalScale, moderateScale} from 'react-native-size-matters';
import {DatePicker, Typography, Input, CurrencyInput, DropDownPicker} from '../../components';
import { Transaction, Category } from '../../realm/Schema';
import { RealmContext } from '../../realm/RealmWrapper';
import Realm from 'realm';
import dayjs from 'dayjs';

export const UpdateTransactionScreen = ({route, navigation}) => {
  const {transactionId} = route.params;

  const { useQuery, useRealm, useObject } = RealmContext
  const realm = useRealm()
  const transactionToBeEdited = useObject(Transaction, new Realm.BSON.ObjectId(transactionId));

  const categories = useQuery(Category, categories => {
    return categories.sorted('dateCreated', true)
  })

  const [categoryList, setCategoryList] = useState(categories.map(({_id, name}) => ({label: name, value: _id.toString()})));

  const [amount, setAmount] = useState((transactionToBeEdited?.amount / 100).toString());
  const [category, setCategory] = useState(transactionToBeEdited?.categoryId?.toString());
  const [description, setDescription] = useState(transactionToBeEdited?.description);
  const [transactionDate, setTransactionDate] = useState(new Date(transactionToBeEdited?.transactionDate));

  const [open, setOpen] = useState(false);

  const onSubmit = async () => {

    if (transactionToBeEdited) {
      const amountInCents = Math.round(Number(amount) * 100);
      realm.write(() => {
        transactionToBeEdited.amount = amountInCents
        transactionToBeEdited.categoryId = category ? new Realm.BSON.ObjectId(category) : null
        transactionToBeEdited.description = description
        transactionToBeEdited.transactionDate = dayjs(transactionDate).startOf('day').toString()
        navigation.goBack();
      });
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Typography text="Amount" type="text-input" />
          <CurrencyInput
            value={amount}
            onChangeValue={setAmount}
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
          <DatePicker value={transactionDate} setValue={setTransactionDate} />
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

