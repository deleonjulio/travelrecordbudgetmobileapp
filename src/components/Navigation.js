/* eslint-disable react/no-unstable-nested-components */
// import {useRef, useEffect} from 'react';
import { Platform } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
    BudgetScreen,
    StartScreen,
    CreateBudgetScreen,
    CategoryScreen,
    CreateCategoryScreen,
    UpdateCategoryScreen,
    BudgetListScreen,
    CreateTransactionScreen,
    SettingsScreen,
    CategoryTransactionListScreen,
    BudgetSearchTransactionScreen,
    PrivacyPolicyScreen
    // SecurityScreen,
    // BiometricsScreen
    // AppearanceScreen
 } from '../screens';
import { BudgetList, SettingsButton} from '../screens/BudgetScreen/components';
import { AddCategoryButton } from '../screens/CategoryScreen/components';
import { AddBudgetScreen } from '../screens/BudgetListScreen/components';
import { colors } from '../config';
import { BudgetArchiveButton, CategoryArchiveButton, TransactionArchiveButton, CategoryUpdateButton } from '.';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { useTheme, useThemeDispatch } from '../context';
import { useIsDarkMode } from '../hooks/useIsDarkMode';
// import CalendarScreen from '../screens/CreateBudgetScreen/CalendarScreen';
// import { useGetTheme } from '../hooks/useGetTheme';

const Tab = createBottomTabNavigator();

function BudgetTabs() {
  const contextTheme = useTheme()
  const isDarkMode = useIsDarkMode(contextTheme)
  
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerStyle: {
          backgroundColor: isDarkMode ? 'black' : 'white',
        },
        headerTitleStyle: {fontWeight: '400', fontSize: moderateScale(17), fontFamily: 'Muli'},
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTintColor: isDarkMode ? 'white' : 'black',
        tabBarIcon: ({color, focused}) => {
          let iconName;
          if (route.name === 'BudgetScreen') {
            if(focused) {
              iconName = 'home';
            } else {
              iconName = 'home-outline';
            }    
          } else if (route.name === 'CategoryScreen') {
            if(focused) {
              iconName = 'view-grid';
            } else {
              iconName = 'view-grid-outline';
            }            
          } else if (route.name === 'SettingsScreen') {
            if(focused) {
              iconName = 'account-circle';
            } else {
              iconName = 'account-circle-outline';
            }
          }

          return <Icon name={iconName} size={moderateScale(34)} color={color} />;
        },
        tabBarActiveTintColor: isDarkMode ? 'white' : 'black',
        // , height: verticalScale(65), paddingVertical: verticalScale(10)
        //
        tabBarIconStyle: {width: '100%'},
        tabBarStyle: {backgroundColor: 'white', height: verticalScale(Platform.OS === 'ios' ? 70 : 60), paddingVertical: moderateScale(Platform.OS === 'ios' ? 4 : 8)},
      })}>
      <Tab.Screen
        name="BudgetScreen"
        component={BudgetScreen}
        options={({route, navigation}) => ({
          headerTitle: 'Budget',
          title: '',
          headerRight: () => <SettingsButton />,
          headerLeft: () => <BudgetList />,
        })}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={({route, navigation}) => ({
          headerTitle: 'Categories',
          title: '',
          headerRight: () => <AddCategoryButton />,
        })}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={({route, navigation}) => ({
          // headerShown: false,
          headerTitle: 'Settings',
          title: '',
        })}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const contextTheme = useTheme()
  // const { themeFromRealm } = useGetTheme()

  const isDarkMode = useIsDarkMode(contextTheme)
  // const dispatch = useThemeDispatch();

  // const themeUpdater = (initialTheme) => {
  //   if(themeFromRealm) {
  //     if(themeFromRealm?.theme === 'device settings') {
  //       dispatch({
  //         type: 'change',
  //         theme: Appearance.getColorScheme()
  //       });
  //     } else {
  //       dispatch({
  //         type: 'change',
  //         theme: themeFromRealm.theme
  //       });
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const initialColorScheme = Appearance.getColorScheme();
  //   themeUpdater(initialColorScheme);

  //   const subscription = Appearance.addChangeListener(
  //     async ({colorScheme}) => {
  //       themeUpdater(colorScheme);
  //     },
  //   );

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="StartScreen"
        screenOptions={{
          headerTitleStyle: {
            fontSize: moderateScale(17),
            fontWeight: '400',
            fontFamily: 'Muli'
          },
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          headerShadowVisible: true,
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
        }}
      >
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
          name="BudgetTabs"
          component={BudgetTabs}
          options={{
            headerShown: false,
            headerTitle: ''
          }}
      />
      {/* <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerTitle: 'Settings',
          animation: 'slide_from_right',
          headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
          },
          }}
      /> */}
      <Stack.Screen
          name="CreateBudgetScreen"
          component={CreateBudgetScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            title: 'Create Budget',
            animation: 'fade_from_bottom',
            headerRight: () => <BudgetArchiveButton route={route} />,
          })}
      />
      <Stack.Screen
          name="CreateCategoryScreen"
          component={CreateCategoryScreen}
          options={{
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: 'New Category',
            animation: 'fade_from_bottom',
          }}
      />
      <Stack.Screen
          name="UpdateCategoryScreen"
          component={UpdateCategoryScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: 'Update Category',
            animation: 'fade_from_bottom',
            headerRight: () => <CategoryArchiveButton route={route} />,
          })}
      />
      <Stack.Screen
          name="BudgetListScreen"
          component={BudgetListScreen}
          options={{
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: 'Budget List',
            animation: 'slide_from_left',
            headerRight: () => <AddBudgetScreen />,
          }}
      />
      <Stack.Screen
          name="CreateTransactionScreen"
          component={CreateTransactionScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            title: 'Create Transaction',
            animation: 'fade_from_bottom',
            headerRight: () => <TransactionArchiveButton route={route} />,
          })}
      />
      <Stack.Screen
          name="CategoryTransactionListScreen"
          component={CategoryTransactionListScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: '',
            animation: 'slide_from_right',
            headerRight: () => <CategoryUpdateButton route={route} />,
          })}
      />
      <Stack.Screen
          name="BudgetSearchTransactionScreen"
          component={BudgetSearchTransactionScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: 'Transaction History',
            animation: 'fade_from_bottom',
          })}
      />
      <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: 'Privacy Policy',
            animation: 'fade_from_bottom',
          })}
      />
      {/* <Stack.Screen
          name="SecurityScreen"
          component={SecurityScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: 'Security',
            animation: 'fade_from_bottom',
          })}
      />
      <Stack.Screen
          name="BiometricsScreen"
          component={BiometricsScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerTitle: '',
            animation: 'fade_from_bottom',
          })}
      /> */}
      {/* <Stack.Screen
          name="AppearanceScreen"
          component={AppearanceScreen}
          options={({route}) => ({
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerTitle: 'Appearance',
            animation: 'fade_from_bottom',
          })}
      /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
