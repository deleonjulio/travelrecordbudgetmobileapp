import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../../../context';
import { useIsDarkMode } from '../../../hooks/useIsDarkMode';

export const AddCategoryButton = () => {
  const navigation = useNavigation();

  const contextTheme = useTheme()
  const isDarkMode = useIsDarkMode(contextTheme);

  return (
      <TouchableOpacity
        style={{paddingRight: 10}}
        onPress={() => navigation.navigate('CreateCategoryScreen')}>
        <Icon name="plus" size={moderateScale(32)} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
  );
};
