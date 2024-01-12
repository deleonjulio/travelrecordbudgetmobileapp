import React, {useState, useEffect, useRef} from 'react';
import {View, Button, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { RealmContext } from '../../realm/RealmWrapper';
import { AccountSettings } from '../../realm/Schema';
import { CATEGORY_INIT } from '../../config';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Text } from '../../components';
import { moderateScale } from 'react-native-size-matters';

const slides = [
  {
    key: 1,
    title: 'Title 1',
    // text: 'Description.\nSay something cool',
    // image: require('./assets/1.jpg'),
    backgroundColor: 'red',
  },
  {
    key: 2,
    title: 'Title 2',
    // text: 'Other cool stuff',
    // image: require('./assets/2.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Title 3',
    // text: 'Hello world',
    // image: require('./assets/2.jpg'),
    backgroundColor: '#febe29',
  },
];

export const StartScreen = ({navigation}) => {
  const refSlider = useRef(null)
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

  const renderItem = ({item}) => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
        <Text>{item.title}</Text>
        {/* <Image source={item.image} /> */}
        <Text>{item.text}</Text>
      </View>
    )
  }

  if (isFirstTime) {
    return (
        <AppIntroSlider 
          ref={refSlider}
          bottomButton
          onDone={init}  
          renderItem={renderItem} 
          data={slides}
          activeDotStyle={{backgroundColor: 'black'}}
          renderNextButton={() => {
            return (
              <TouchableOpacity onPress={() => refSlider.current.goToSlide(refSlider?.current?.state?.activeIndex + 1)}style={[styles.button, { backgroundColor: 'black' }]}>
                <Text style={[styles.buttonText, { color: 'white' }]}>Next</Text>
              </TouchableOpacity>
              )
          }}
          renderDoneButton={() => {
            return (
              <TouchableOpacity onPress={init}style={[styles.button, { backgroundColor: 'black' }]}>
                <Text style={[styles.buttonText, { color: 'white' }]}>Done</Text>
              </TouchableOpacity>
              )
          }}
        />
      // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white'}}>
      //   <Button title="Start" onPress={init} />
      // </View>
    );
  }
};


const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    padding: moderateScale(10),
    borderRadius: moderateScale(6),
    alignItems: 'center',
    backgroundColor: 'black'
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontFamily: 'Muli-Bold',
    color: 'white'
  },
})