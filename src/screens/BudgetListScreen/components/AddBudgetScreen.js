import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale } from 'react-native-size-matters';

export const AddBudgetScreen = () => {
  const navigation = useNavigation();

  return (
      <TouchableOpacity
        style={{paddingRight: 10}}
        onPress={() => navigation.navigate('CreateBudgetScreen')}>
        <Icon name="plus" size={moderateScale(32)} color={'black'} />
      </TouchableOpacity>
  );
};
