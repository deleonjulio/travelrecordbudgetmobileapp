import React, {useState} from 'react';
import {View, Text, SafeAreaView, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {Input, Typography, CurrencyInput, DropDownPicker, Calendar} from '../../components';
import { CURRENCY_LIST } from '../../config';
import { RealmContext } from '../../realm/RealmWrapper';
import { Budget } from '../../realm/Schema';
import Realm from 'realm';

export const UpdateBudgetScreen = ({route, navigation}) => {
  const {budgetId} = route.params;

  const { useRealm, useObject } = RealmContext
  const realm = useRealm()
  const budgetToBeUpdated = useObject(Budget, new Realm.BSON.ObjectId(budgetId));

  const [showCalendar, setShowCalendar] = useState(false)
  
  const [budgetName, setBudgetName] = useState(budgetToBeUpdated?.name);
  const [budgetAmount, setBudgetAmount] = useState((budgetToBeUpdated?.amount / 100).toString());
  const [date, setDate] = useState([budgetToBeUpdated.startDate, budgetToBeUpdated.endDate])
  const [currency, setCurrency] = useState(budgetToBeUpdated.currency);

  const [open, setOpen] = useState(false);
  const [currencyList, setCurrencyList] = useState(CURRENCY_LIST);

  const onSubmit = async () => {
    if (budgetToBeUpdated) {
      const amountInCents = Math.round(Number(budgetAmount) * 100);
      realm.write(() => {
        budgetToBeUpdated.name = budgetName
        budgetToBeUpdated.amount = amountInCents
        budgetToBeUpdated.startDate = new Date(date[0])
        budgetToBeUpdated.endDate = new Date(date[1])
        budgetToBeUpdated.currency = currency
        navigation.goBack();
      });
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Typography text="Budget Name" type="text-input" />
          <Input
            setValue={e => setBudgetName(e)}
            value={budgetName}
            placeholder="Budget name"
          />
        </View>
        <View>
          <Typography text="Amount" type="text-input" />
          <CurrencyInput
            value={budgetAmount}
            onChangeValue={setBudgetAmount}
          />
        </View>
        <View>
          <Typography text="Date Range" type="text-input" />
          <Calendar show={showCalendar} setShow={setShowCalendar} date={date} setDate={setDate} />
        </View>
        <View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography text="Currency" type="text-input" />
          <TouchableOpacity onPress={() => setCurrency(null)}>
            <Text style={{fontSize: moderateScale(14), color: 'black'}}>Unselect</Text>
          </TouchableOpacity>
          </View>
          <DropDownPicker
              open={open}
              setOpen={setOpen}
              value={currency}
              setValue={setCurrency}
              items={currencyList}
              setItems={setCurrencyList}
            />
        </View>
        <TouchableOpacity style={styles.button}
          onPress={() => onSubmit()}>
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
