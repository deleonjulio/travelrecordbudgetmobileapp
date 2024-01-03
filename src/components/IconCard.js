import { View, StyleSheet } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, moderateScale, verticalScale } from "react-native-size-matters";

export const IconCard = ({icon, isDarkMode = false, iconColor = 'black', backgroundColor = 'lightgray'}) => {
  return (
    <View style={styles.card({backgroundColor})}>
      <Icon name={icon ? icon: 'progress-question'} size={moderateScale(26)} color={iconColor ? iconColor : 'black'} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: ({backgroundColor}) => ({
    backgroundColor: backgroundColor ? backgroundColor : 'lightgray', 
    // padding: moderateScale(14), 
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(0.5), 
    borderColor: 'transparent',
    // elevation: moderateScale(2)
  }),
});
