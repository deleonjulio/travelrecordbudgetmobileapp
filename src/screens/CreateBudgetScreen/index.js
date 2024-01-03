import React, {useState, useRef} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {CURRENCY_LIST} from '../../config';
import {Input, Typography, CurrencyInput, DropDownPicker, Calendar} from '../../components';
import { RealmContext } from '../../realm/RealmWrapper';
import { Budget } from '../../realm/Schema';

export const CreateBudgetScreen = ({navigation}) => {
  const nameRef = useRef(null);

  const { useRealm, useQuery } = RealmContext
  const realm = useRealm()

  const [showCalendar, setShowCalendar] = useState(false)

  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [date, setDate] = useState(null)
  const [currency, setCurrency] = useState(null);

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

    try {
      realm.write(() => {
        realm.create('Budget', newBudget)
        navigation.goBack()
      });

    } catch (error) {
      console.log(error, 'Error create budget')
    }
  };

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
            onLayout={() => nameRef.current.focus()} 
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