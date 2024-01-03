import * as React from 'react';
import {View, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from '../../context';
import { useIsDarkMode } from '../../hooks/useIsDarkMode';
import { Text } from '../../components';
import { RealmContext } from '../../realm/RealmWrapper';

const appSettingsOption = [
  {
    title: 'Security',
    icon: 'lock',
    screen: 'SecurityScreen'
  },
  {
    title: 'Appearance',
    icon: 'theme-light-dark',
    screen: null
  },
  {
    title: 'Language',
    icon: 'earth'
  },
]

const generalOption = [
  {
    title: 'About',
    icon: 'help-circle',
    screen: null
  },
  {
    title: 'Terms & conditions',
    icon: 'newspaper-check',
    screen: null
  },
  {
    title: 'Privacy policy',
    icon: 'security',
    screen: null
  },
]

const DeleteAllDataOption = ({navigation}) => {
  const { useRealm } = RealmContext
  const realm = useRealm();

  const deleteAllData = () => {
    realm.write(() => {
      realm.deleteAll();
      navigation.replace('StartScreen');
    });
  };

  const confirmDeletion = () => Alert.alert('Delete All Data', 'Are you sure you want to delete all data?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Delete All',
      onPress: deleteAllData,
      style: 'destructive'
    },
  ]);

  return (
    <TouchableOpacity style={styles.optionContainer} onPress={() => confirmDeletion()}>
      <View style={styles.iconTextContainer}>
        <Icon name="delete-forever" size={moderateScale(28)} color={'red'} />
        <Text style={[styles.optionText, { color: 'red' }]}>Delete All Data</Text>
      </View>
      {/* <Icon name="chevron-right" size={moderateScale(28)} color={'red'}  /> */}
    </TouchableOpacity>
  )
}

const Option = ({title, icon, screen, navigation, isDarkMode}) => {

  return (
    <TouchableOpacity style={styles.optionContainer} onPress={() => screen && navigation.navigate(screen)}>
      <View style={styles.iconTextContainer}>
        <Icon name={icon} size={moderateScale(28)} color={isDarkMode ? 'white' : 'black'} />
        <Text style={isDarkMode ? styles.optionTextDark : styles.optionText}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={moderateScale(28)} color={isDarkMode ? 'white' : 'black'}  />
    </TouchableOpacity>
  )
}

export const SettingsScreen = ({navigation}) => {
  const contextTheme = useTheme()
  const isDarkMode = useIsDarkMode(contextTheme);

  return (
    <SafeAreaView style={{height: '100%', backgroundColor: 'white'}}>
      <ScrollView style={{backgroundColor: isDarkMode ? 'black' : 'white', paddingHorizontal: scale(24)}} bounces={false}>
        {/* {Platform.OS === 'android' && (
          <>
              <Text style={[isDarkMode ? styles.titleDark : styles.title, styles.separator]}>Account Settings</Text>
              {accountSettingsOption.map(({title, icon, screen}) => {
                return (
                  <Option key={title} title={title} icon={icon} screen={screen} navigation={navigation} isDarkMode={isDarkMode} />
                )
              })}

          </>
        )} */}

        {/* <Text style={[styles.title, styles.separator]}>Application Settings</Text>
        {appSettingsOption.map(({title, icon, screen}) => {
          return (
            <Option key={title} title={title} icon={icon} screen={screen} navigation={navigation} isDarkMode={isDarkMode} />
          )
        })} */}

        {/* <Text style={[isDarkMode ? styles.titleDark : styles.title, styles.separator]}>Settings</Text> */}
        {generalOption.map(({title, icon}) => {
          return (
            <Option key={title} title={title} icon={icon} isDarkMode={isDarkMode} />
          )
        })}
        <DeleteAllDataOption navigation={navigation} />

        <View style={[styles.separator, styles.versionContainer]}>
          <Text style={styles.version}>Version: {DeviceInfo.getVersion()}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: moderateScale(17),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-SemiBold'}),
  },
  titleDark: {
    color: 'white',
    fontSize: moderateScale(17),
    fontWeight: '700'
  },
  optionContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'whitesmoke'
  },
  iconTextContainer: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    columnGap: scale(8),
    paddingVertical: verticalScale(12),
  },
  optionTextDark: {
    color: 'white',
    fontSize: moderateScale(17),
    fontWeight: '300',
    letterSpacing: scale(0.5)
  },
  optionText: {
    color: 'black',
    fontSize: moderateScale(17),
    fontWeight: '300',
    letterSpacing: scale(0.5)
  },
  separator: {
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(16)
  },
  name: {
    paddingTop: verticalScale(24),
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    letterSpacing: scale(0.5)
  },
  versionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  version: {
    fontSize: moderateScale(14),
    color: 'gray'
  }
})