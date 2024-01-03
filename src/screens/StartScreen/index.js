import React, {useState, useEffect} from 'react';
import {View, Button} from 'react-native';
import { RealmContext } from '../../realm/RealmWrapper';
import { AccountSettings } from '../../realm/Schema';
import { CATEGORY_INIT } from '../../config';

export const StartScreen = ({navigation}) => {
  const { useRealm, useQuery } = RealmContext
  const accountSettings = useQuery(AccountSettings)
  const realm = useRealm()
  const [isFirstTime, setIsFirstTime] = useState(null);

  const init = async () => {
    try {
      realm.write(() => {
        realm.create('AccountSettings',  {
          useBiometric: false,
          theme: 'device settings',
        })
        
        CATEGORY_INIT.forEach(category => {
          realm.create('Category', category);
        });
        
        navigation.replace('BudgetTabs');
      });

    } catch (error) {
      console.log(error, 'init');
    }
  };

  useEffect(() => {
    const getFirstTimeStatus = async () => {
      if(accountSettings.length === 0) {
        setIsFirstTime(true)
      } else {
        navigation.replace('BudgetTabs');
      }
    };

    getFirstTimeStatus();
  }, []);

  if (isFirstTime) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white'}}>
        <Button title="Start" onPress={init} />
      </View>
    );
  }
};
