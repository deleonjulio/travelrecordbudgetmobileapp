import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../../../context';
import { useIsDarkMode } from '../../../hooks/useIsDarkMode';
import { RealmContext } from '../../../realm/RealmWrapper';

export const BudgetList = () => {
  const { useQuery } = RealmContext

  let budgets = useQuery('Budget', budgets => {
      return budgets.filtered('archived == $0', false).sorted('selected', true);
  });

  const navigation = useNavigation();

  const contextTheme = useTheme()
  const isDarkMode = useIsDarkMode(contextTheme)

  if(budgets.length) {
    return (
      <TouchableOpacity
        style={{paddingLeft: 10}}
        onPress={() => navigation.navigate('BudgetListScreen')}>
        <Icon name="history" size={moderateScale(32)} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
    );
  }


  return null
};
