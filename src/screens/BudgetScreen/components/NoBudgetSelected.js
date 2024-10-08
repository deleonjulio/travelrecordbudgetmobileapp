import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const NoBudgetSelected = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Icon
        name="cash-multiple"
        color={'black'}
        size={moderateScale(120)}
      />
      <Text style={styles.title}>You currently have no budget.</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateBudgetScreen')}>
        <Text style={styles.createButtonText}>Create Budget</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      rowGap: verticalScale(12),
      paddingHorizontal: scale(24),
  },
  title: {
    color: 'black',
    fontSize: moderateScale(17),
    textAlign: 'center',
    fontWeight: '400',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli'}),
  },
  createButton: {
    backgroundColor: 'black',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(4),
  },
  createButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '600',
    ...(Platform.OS === 'android' && {fontFamily: 'Muli-Bold'}),
  }
})