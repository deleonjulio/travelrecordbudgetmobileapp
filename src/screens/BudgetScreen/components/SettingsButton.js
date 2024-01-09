import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';
import { RealmContext } from '../../../realm/RealmWrapper';
import { Budget } from '../../../realm/Schema';
import { useTheme } from '../../../context';
import { useIsDarkMode } from '../../../hooks/useIsDarkMode';

export const SettingsButton = () => {
  const navigation = useNavigation();
  const { useQuery } = RealmContext

  const contextTheme = useTheme()
  const isDarkMode = useIsDarkMode(contextTheme)

  const selectedBudget = useQuery(Budget, budgets => {
    return budgets.filtered('selected == $0', true);
  })[0];

  if(selectedBudget) {
    return (
      <TouchableOpacity
        style={{paddingRight: 10}}
        onPress={() => navigation.navigate('CreateBudgetScreen', {
          budgetId: selectedBudget?._id.toString()
        })}>
        <Icon name="square-edit-outline" size={moderateScale(32)} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
    );
  }

  return null
};
