/* eslint-disable prettier/prettier */
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {CURRENCY_LIST} from '../../config';
import {Input, Typography, CurrencyInput, DropDownPicker, Calendar} from '../../components';
import { RealmContext } from '../../realm/RealmWrapper';
import { Budget } from '../../realm/Schema';
import Realm from 'realm';

export const CreateBudgetScreen = ({route, navigation}) => {
  const {budgetId} = route?.params || {};

  const nameRef = useRef(null);

  const { useRealm, useQuery, useObject} = RealmContext
  const realm = useRealm()
  const budgetToBeUpdated = budgetId && useObject(Budget, new Realm.BSON.ObjectId(budgetId));

  const [showCalendar, setShowCalendar] = useState(false)

  const [budgetName, setBudgetName] = useState(budgetToBeUpdated ? budgetToBeUpdated?.name : '');
  const [budgetAmount, setBudgetAmount] = useState(budgetToBeUpdated ? (budgetToBeUpdated?.amount / 100).toString() : 0);
  const [date, setDate] = useState(budgetToBeUpdated ? [budgetToBeUpdated.startDate, budgetToBeUpdated.endDate] : null)
  const [currency, setCurrency] = useState(budgetToBeUpdated ? budgetToBeUpdated.currency : null);

  const [open, setOpen] = useState(false);
  const [currencyList, setCurrencyList] = useState(CURRENCY_LIST);

  const activeBudgets = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0', true);
  });

  const onSubmit = async () => {
    if(date === null) {
      return Alert.alert('Something went wrong!');
    }

    const amountInCents = Math.round(Number(budgetAmount) * 100);

      realm.write(() => {
        if (budgetToBeUpdated) {
          budgetToBeUpdated.name = budgetName
          budgetToBeUpdated.amount = amountInCents
          budgetToBeUpdated.startDate = new Date(date[0])
          budgetToBeUpdated.endDate = new Date(date[1])
          budgetToBeUpdated.currency = currency
        } else {
          const newBudget = {
            name: budgetName,
            amount: amountInCents,
            currency,
            selected: activeBudgets.length === 0 ? true : false,
            startDate: new Date(date[0]),
            endDate: new Date(date[1]),
            dateCreated: new Date(),
            archived: false
          };
          realm.create('Budget', newBudget)
        }
        navigation.goBack();
      });
  };

  useEffect(() => {
    if(budgetId) {
      navigation.setOptions({ title: 'Update Budget' })
    }
  }, [budgetId])

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Typography text="Budget Name" type="text-input" />
          <Input
            ref={nameRef}
            setValue={e => setBudgetName(e)}
            value={budgetName}
            placeholder="Budget name"
            onLayout={() => !budgetId && nameRef.current.focus()} 
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